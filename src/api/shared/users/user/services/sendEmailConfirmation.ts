import { prisma } from '../../../../../../prisma';

import { EmailTransporterServices } from '../../../../../utils/emailTransporter/emailTransporterServices';

const emailTransporter = new EmailTransporterServices();

interface ISendEmailConfirmation {
  email: string;
  link: string;
  userId: string;
}

export async function sendEmailConfirmation({ email, link, userId }: ISendEmailConfirmation) {
  const company = await prisma.company.findFirst({
    select: {
      image: true,
    },

    where: {
      UserCompanies: {
        some: {
          userId,
        },
      },
    },
  });

  await emailTransporter.sendConfirmEmail({
    subject: 'Confirmação de e-mail',
    text: 'Você está recebendo esta mensagem pois seu e-mail foi apontado como responsável por uma edificação!',
    link,
    toEmail: email,
    companyLogo: company?.image || '',
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      lastNotificationDate: new Date(),
    },
  });
}
