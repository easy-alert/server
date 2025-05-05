import { prisma } from '../../../../../../prisma';

import { EmailTransporterServices } from '../../../../../utils/emailTransporter/emailTransporterServices';
import { TokenServices } from '../../../../../utils/token/tokenServices';

const emailTransporter = new EmailTransporterServices();
const tokenServices = new TokenServices();

interface ISendEmailConfirmation {
  email: string;
  link?: string;
  userId: string;
}

export async function sendEmailConfirmation({ email, link, userId }: ISendEmailConfirmation) {
  let webLink = link;

  if (!webLink) {
    const token = tokenServices.generate({
      tokenData: {
        id: userId,
        confirmType: 'email',
      },
    });

    await tokenServices.saveInDatabase({ token });

    webLink = `${process.env.BASE_COMPANY_URL}/confirm/email?token=${token}`;
  }

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
    text: 'Você está recebendo esta mensagem pois seu e-mail foi apontado como responsável por uma empresa!',
    link: webLink,
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
