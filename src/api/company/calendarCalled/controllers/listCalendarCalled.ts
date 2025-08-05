import { Request, Response } from 'express';

import { checkValues } from '../../../../utils/newValidator/checkValues';
import { getCalendarEvents } from '../services/getCalendarEvents';

export async function listCalendarTickets(req: Request, res: Response) {
  const companyId = req.query.companyId as string;
  const year = Number(req.params.year);
  const buildingId = req.query.buildingId as string | undefined;

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId },
    { label: 'Ano', type: 'int', value: year },
  ]);

  try {
    const { buildings, Days } = await getCalendarEvents({ companyId, year, buildingId });

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
