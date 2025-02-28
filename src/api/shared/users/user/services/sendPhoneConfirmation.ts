import { prisma } from '../../../../../../prisma';

import { ZenviaServices } from '../../../../../utils/customsApis/Zenvia/services/zenviaServices';
import { TokenServices } from '../../../../../utils/token/tokenServices';

const zenviaServices = new ZenviaServices();
const tokenServices = new TokenServices();

interface ISendPhoneConfirmation {
  phoneNumber: string;
  link?: string;
  userId: string;
}

export async function sendPhoneConfirmation({ phoneNumber, link, userId }: ISendPhoneConfirmation) {
  let webLink = link;

  if (!webLink) {
    const token = tokenServices.generate({
      tokenData: {
        id: userId,
        confirmType: 'whatsapp',
      },
    });

    const createdToken = await tokenServices.saveInDatabase({ token });

    webLink = `${process.env.BASE_COMPANY_URL}/confirm/phone?tokenId=${createdToken.id}`;
  }

  await zenviaServices.postWhatsappConfirmation({
    receiverPhoneNumber: phoneNumber,
    link: webLink,
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      lastNotificationDate: new Date(),
    },
  });
}
