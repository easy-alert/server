import { ServerMessage } from '../../../messages/serverMessage';
import { ApiZenvia } from '../apiZenvia';
import { IPostWhatsappConfirmation } from './types';

export class ZenviaServices {
  async postWhatsappConfirmation({ receiverPhoneNumber, link }: IPostWhatsappConfirmation) {
    try {
      ApiZenvia.post('/v2/channels/whatsapp/messages', {
        from: '554891538634',
        to: `55${receiverPhoneNumber}`,
        contents: [
          {
            type: 'template',
            templateId: process.env.CONFIRMATION_TEMPLATE_ZENVIA,
            fields: {
              link,
            },
          },
        ],
      });
    } catch (error) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de WhatsApp.',
      });
    }
  }
}
