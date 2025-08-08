import type { Request, Response } from 'express';
import { checkValues } from '../../../../utils/newValidator/checkValues';
import { getCalendarEvents } from '../services/getCalendarEvents';

export async function listCalendarTickets(req: Request, res: Response) {
  const { companyId, year, month, buildingIds } = req.query as unknown as {
    companyId: string;
    year: number;
    month: number;
    buildingIds?: string;
  };

  const buildingsFilter =
    !buildingIds || buildingIds === 'undefined' ? undefined : buildingIds.split(',');

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId },
    { label: 'Ano', type: 'int', value: Number(year) },
  ]);

  try {
    const { Days } = await getCalendarEvents({
      companyId,
      year,
      month,
      buildingIds: buildingsFilter,
    });

    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: 'Chamados do calendário listados com sucesso.',
      },
      Days,
    });
  } catch (error: any) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: error.message || 'Erro ao buscar chamados do calendário.',
      },
    });
  }
}
