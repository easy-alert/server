import type { Request, Response } from 'express';
import { checkValues } from '../../../../utils/newValidator/checkValues';
import { getCalendarEvents } from '../services/getCalendarEvents';

export async function listCalendarTickets(req: Request, res: Response) {
  const companyId = req.query.companyId as string;
  const year = Number(req.query.year);
  const month = Number(req.query.month);

  const buildingIds = req.query.buildingIds
    ? (req.query.buildingIds as string).split(',')
    : undefined;

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId },
    { label: 'Ano', type: 'int', value: year },
    { label: 'Mês', type: 'int', value: month },
  ]);

  try {
    const { buildings, Days } = await getCalendarEvents({
      companyId,
      year,
      month,
      buildingIds,
    });

    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: 'Chamados do calendário listados com sucesso.',
      },
      buildings,
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
