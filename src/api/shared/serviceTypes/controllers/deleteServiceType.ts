import { Request, Response } from 'express';
import { prisma } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export async function deleteServiceType(req: Request, res: Response) {
  const { serviceTypeId } = req.params as { serviceTypeId: string };

  if (!serviceTypeId)
    throw new ServerMessage({ statusCode: 400, message: 'ID do tipo não informado.' });

  const serviceType = await prisma.serviceType.findUnique({ select: { id: true, companyId: true }, where: { id: serviceTypeId } });
  if (!serviceType) throw new ServerMessage({ statusCode: 404, message: 'Tipo não encontrado.' });

  if (serviceType.companyId && serviceType.companyId !== req.Company?.id) {
    throw new ServerMessage({ statusCode: 403, message: 'Sem permissão para excluir este tipo.' });
  }

  try {
    await prisma.serviceType.delete({ where: { id: serviceTypeId } });
  } catch (error: any) {
    const message = 'Este tipo de assistência está em uso e não pode ser excluído';
    throw new ServerMessage({ statusCode: 400, message });
  }

  return res
    .status(200)
    .json({ ServerMessage: { statusCode: 200, message: 'Tipo excluído com sucesso.' } });
}


