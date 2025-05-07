import { Response, Request } from 'express';

import { findTicketReportPDFById } from '../services/findTicketReportPDFById';
import { updateTicketReportPDF } from '../services/updateTicketReportPDF';
import { findMaintenanceReportPDFById } from '../services/findMaintenanceReportPDFById';
import { updateMaintenanceReportPDF } from '../services/updateMaintenanceReportPDF';

export async function updateReportPDFController(req: Request, res: Response) {
  const { reportPDFId } = req.params;
  const { reportType } = req.query;
  const { reportName } = req.body;

  if (!reportType) {
    return res.status(400).json({ message: 'Tipo de relatório não informado' });
  }

  if (!reportPDFId) {
    return res.status(400).json({ message: 'ID do relatório não informado' });
  }

  if (reportType === 'ticket') {
    const ticketReportPDF = await findTicketReportPDFById({ reportPDFId });

    if (!ticketReportPDF) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    await updateTicketReportPDF({
      updatedTicketReportPDF: {
        id: ticketReportPDF.id,
        name: reportName,
      },
    });

    return res.status(200).json({ message: 'Relatório atualizado com sucesso' });
  }

  if (reportType === 'maintenance') {
    const maintenanceReportPDF = await findMaintenanceReportPDFById({ reportPDFId });

    if (!maintenanceReportPDF) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    await updateMaintenanceReportPDF({
      updatedMaintenanceReportPDF: {
        id: maintenanceReportPDF.id,
        name: reportName,
      },
    });

    return res.status(200).json({ message: 'Relatório atualizado com sucesso' });
  }

  return res.status(400).json({ message: 'Tipo de relatório inválido' });
}
