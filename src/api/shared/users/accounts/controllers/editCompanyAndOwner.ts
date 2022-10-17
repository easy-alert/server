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
  body: { name, email, image, CNPJ, CPF, contactNumber, companyName, password },
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
  ]);

  if (!CNPJ && !CPF) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Informe um CNPJ ou CPF.`,
    });
  }
  if (CNPJ) {
    const checkCNPJ = await sharedCompanyServices.findByCNPJ({ CNPJ });
    validator.cannotExists([{ label: 'CNPJ', variable: checkCNPJ }]);
  }
  if (CPF) {
    const checkCPF = await sharedCompanyServices.findByCPF({ CPF });
    validator.cannotExists([{ label: 'CPF', variable: checkCPF }]);
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
  });

  if (password) {
    await userServices.editPassword({
      userId,
      password,
    });
  }
}
