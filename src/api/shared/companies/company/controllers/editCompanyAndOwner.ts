/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// CLASS
import { UserServices } from '../../../user/services/userServices';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedCompanyServices } from '../services/sharedCompanyServices';
import { IEditCompanyBody } from './types';

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
    { label: 'nome', variable: name },
    { label: 'email', variable: email },
    { label: 'imagem', variable: image },
  ]);

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
