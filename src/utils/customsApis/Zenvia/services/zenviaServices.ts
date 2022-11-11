import { ServerMessage } from '../../../messages/serverMessage';
import { ApiZenvia } from '../apiZenvia';
import { IPostWhatsappConfirmation } from './types';

export class ZenviaServices {
  async postWhatsappConfirmation({ receiverPhoneNumber, link }: IPostWhatsappConfirmation) {
    try {
      ApiZenvia.post('/v2/channels/whatsapp/messages', {
        from: process.env.SENDER_PHONE_NUMBER,
        to: receiverPhoneNumber,
        contents: [
          {
            type: 'template',
            templateId: process.env.CONTENT_TEMPLATE_ID,
            fields: {
              link,
            },
          },
        ],
      });
    } catch (error) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Erro na API Zenvia',
      });
    }
  }
}
