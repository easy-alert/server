/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { dashboardServices } from '../services/dashboardServices';

export async function listAuxiliaryData(req: Request, res: Response) {
  const { buildingsData, categoriesData } = await dashboardServices.listAuxiliaryData(
    req.Company.id,
  );

  let buildings: string[] = [];
  let responsibles: string[] = [];
  let categories: string[] = [];
  const periods = [
    {
      label: '30 dias',
      period: 30,
    },
    {
      label: '3 meses',
      period: 90,
    },
    {
      label: '6 meses',
      period: 180,
    },
    {
      label: '1 ano',
      period: 365,
    },
    {
      label: '2 anos',
      period: 730,
    },
  ];

  buildingsData.forEach((building) => {
    buildings.push(building.name);
    responsibles.push(...building.NotificationsConfigurations.map((config) => config.name));
  });

  buildings = [...new Set(buildings)].sort((a, b) => a.localeCompare(b));
  responsibles = [...new Set(responsibles)].sort((a, b) => a.localeCompare(b));
  categories = [...new Set(categoriesData.map((category) => category.name))].sort((a, b) =>
    a.localeCompare(b),
  );

  return res.status(200).json({ buildings, responsibles, categories, periods });
}
