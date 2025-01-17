import { Request, Response } from 'express';
import { prisma } from '../../../prisma';

export async function migrateSuppliers(req: Request, res: Response) {
  const { companyId, migrateCompanyId } = req.body;

  if (!companyId) {
    return res.status(400).json({
      message: 'companyId is required   ',
    });
  }

  const suppliersToMigrate = await prisma.supplier.findMany({
    select: {
      name: true,
      image: true,
      link: true,
      phone: true,
      email: true,
      city: true,
      cnpj: true,
      state: true,
    },
    where: {
      companyId,
    },
  });

  if (migrateCompanyId) {
    await prisma.supplier.createMany({
      data: suppliersToMigrate.map((supplier) => ({
        ...supplier,
        companyId: migrateCompanyId,
      })),
    });

    return res.status(200).json({
      message: 'Suppliers migrated successfully',
    });
  }

  return res.status(200).json({
    message: 'Suppliers not migrated',
  });
}
