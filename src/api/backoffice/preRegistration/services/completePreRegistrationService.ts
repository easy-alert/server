import { prisma } from '../../../../../prisma';

import { UserServices } from '../../../shared/users/user/services/userServices';
import { PermissionServices } from '../../../shared/permissions/permission/services/permissionServices';
import { createUserPermissions } from '../../../shared/users/userPermission/services/createUserPermissions';
import { SharedCompanyServices } from '../../../shared/users/accounts/services/sharedCompanyServices';
import { CompanyServices } from '../../account/companies/services/companyServices';

const userServices = new UserServices();
const companyServices = new CompanyServices();
const permissionServices = new PermissionServices();
const sharedCompanyServices = new SharedCompanyServices();

interface ICompleteRegistrationData {
  clientName: string;
  cnpj: string;
  loginEmail: string;
  password: string;
  contactPhone: string;
}

export async function completePreRegistrationService(
  token: string,
  clientData: ICompleteRegistrationData,
) {
  return prisma.$transaction(async (tx) => {
    const preRegistration = await tx.preRegistration.findFirst({
      where: { id: token, status: 'pending', expiresAt: { gte: new Date() } },
    });
    if (!preRegistration) {
      throw new Error('Link de pré-cadastro inválido, expirado ou já utilizado.');
    }

    const emailLowerCase = clientData.loginEmail.toLowerCase();
    const checkEmailUser = await userServices.findUniqueEmail({ email: emailLowerCase });
    if (checkEmailUser) {
      throw new Error('Este e-mail já está em uso.');
    }

    const checkCNPJ = await sharedCompanyServices.findByCNPJ({ CNPJ: clientData.cnpj });
    if (checkCNPJ) {
      throw new Error('Este CNPJ já está em uso.');
    }

    const newUser = await userServices.create({
      name: clientData.clientName,
      email: clientData.loginEmail.toLowerCase(),
      passwordHash: clientData.password,
      phoneNumber: clientData.contactPhone,
      role: 'owner',
      image: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURI(clientData.clientName)}`,
    });

    const newCompany = await companyServices.create({
      name: clientData.clientName,
      CNPJ: clientData.cnpj,
      contactNumber: clientData.contactPhone,
      clientType: preRegistration.clientType,
      image: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURI(clientData.clientName)}`,
      CPF: null,
      isNotifyingOnceAWeek: false,
      canAccessChecklists: false,
      canAccessTickets: false,
      receiveDailyDueReports: false,
      receivePreviousMonthReports: false,
    });

    await companyServices.createUserCompany({
      userId: newUser.id,
      companyId: newCompany.id,
      owner: true,
    });

    const adminPermission = await permissionServices.findByName({ name: 'admin:company' });
    const backofficePermission = await permissionServices.findByName({ name: 'access:backoffice' });

    if (!adminPermission || !backofficePermission) {
      throw new Error('Permissões padrão não encontradas no sistema.');
    }

    await createUserPermissions({
      data: {
        data: {
          companyId: newCompany.id,
          userId: newUser.id,
          permissionId: adminPermission.id,
        },
      },
    });
    await createUserPermissions({
      data: {
        data: {
          companyId: newCompany.id,
          userId: newUser.id,
          permissionId: backofficePermission.id,
        },
      },
    });

    await tx.preRegistration.update({
      where: { id: token },
      data: {
        status: 'completed',
        createdUserId: newUser.id,
        createdCompanyId: newCompany.id,
      },
    });

    return { user: newUser, company: newCompany };
  });
}
