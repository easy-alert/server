import { prisma } from '../../../../../../prisma';

import { ZenviaServices } from '../../../../../utils/customsApis/Zenvia/services/zenviaServices';

const zenviaServices = new ZenviaServices();

interface ISendPhoneConfirmation {
  phoneNumber: string;
  link: string;
  userId: string;
}

export async function sendPhoneConfirmation({ phoneNumber, link, userId }: ISendPhoneConfirmation) {
  await zenviaServices.postWhatsappConfirmation({
    receiverPhoneNumber: phoneNumber,
    link,
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      lastNotificationDate: new Date(),
    },
  });
}
