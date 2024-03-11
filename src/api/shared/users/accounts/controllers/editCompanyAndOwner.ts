/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// CLASS
import { UserServices } from '../../user/services/userServices';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedCompanyServices } from '../services/sharedCompanyServices';
import { IEditCompanyBody } from './types';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

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
    supportLink,
    canAccessChecklists,
  },
  userId,
  companyId,
}: IEditCompanyBody) {
  validator.notNull([
    { label: 'ID de usuário', variable: userId },
    { label: 'ID da empresa', variable: companyId },
    { label: 'nome', variable: name },
    { label: 'e-mail', variable: email },
    { label: 'imagem', variable: image },
    { label: 'Número de contato', variable: contactNumber },
    { label: 'nome da empresa', variable: companyName },
    // { label: 'frequência de notificações', variable: isNotifyingOnceAWeek },
  ]);

  if (!CNPJ && !CPF) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Informe um CNPJ ou CPF.`,
    });
  }

  await userServices.findByEmailForEdit({
    email,
    userId,
  });

  await userServices.edit({
    userId,
    name,
    email,
  });

  await sharedCompanyServices.edit({
    CNPJ,
    companyId,
    contactNumber,
    CPF,
    image,
    name: companyName,
    isNotifyingOnceAWeek,
    supportLink,
    canAccessChecklists,
  });

  if (password) {
    await userServices.editPassword({
      userId,
      password,
    });
  }
}
