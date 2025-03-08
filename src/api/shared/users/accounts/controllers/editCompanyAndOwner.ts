/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// CLASS
import { UserServices } from '../../user/services/userServices';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedCompanyServices } from '../services/sharedCompanyServices';
import { IEditCompanyBody } from './types';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { unmask } from '../../../../../utils/dataHandler';
import { checkValues } from '../../../../../utils/newValidator';

const userServices = new UserServices();
const validator = new Validator();
const sharedCompanyServices = new SharedCompanyServices();

export async function sharedEditCompanyAndOwner({
  body: {
    name,
    email,
    image,
    CNPJ,
    CPF,
    contactNumber,
    companyName,
    password,
    isNotifyingOnceAWeek,
    canAccessChecklists,
    canAccessTickets,
    receiveDailyDueReports,
    receivePreviousMonthReports,
    ticketInfo,
    ticketType,
    showMaintenancePriority,
  },
  userId,
  companyId,
}: IEditCompanyBody) {
  validator.notNull([
    { label: 'ID de usuário', variable: userId },
    { label: 'ID da empresa', variable: companyId },
    { label: 'nome', variable: name },
    { label: 'e-mail', variable: email },
    { label: 'telefone', variable: contactNumber },
    { label: 'imagem', variable: image },
    { label: 'Número de contato', variable: contactNumber },
    { label: 'nome da empresa', variable: companyName },
  ]);

  if (!CNPJ && !CPF) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Informe um CNPJ ou CPF.`,
    });
  }

  if (ticketType === 'whatsapp') {
    checkValues([{ label: 'Informação para o chamado', type: 'phone', value: ticketInfo }]);
  }

  if (ticketType === 'email') {
    checkValues([{ label: 'Informação para o chamado', type: 'email', value: ticketInfo }]);
  }

  await userServices.findByEmailForEdit({
    email,
    userId,
  });

  await userServices.edit({
    userId,
    name,
    email,
    phoneNumber: contactNumber,
  });

  const lowerCaseTicketInfo = ticketInfo ? ticketInfo.toLowerCase() : null;

  await sharedCompanyServices.edit({
    CNPJ,
    companyId,
    contactNumber,
    CPF,
    image,
    name: companyName,
    isNotifyingOnceAWeek,
    canAccessChecklists,
    canAccessTickets,
    receiveDailyDueReports,
    receivePreviousMonthReports,
    showMaintenancePriority,
    ticketInfo:
      lowerCaseTicketInfo && ticketType === 'whatsapp'
        ? unmask(lowerCaseTicketInfo)
        : lowerCaseTicketInfo || null,
    ticketType,
  });

  if (password) {
    await userServices.editPassword({
      userId,
      password,
    });
  }
}
