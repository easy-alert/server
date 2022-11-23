// #region IMPORTS
import { createTransport } from 'nodemailer';
import { ServerMessage } from '../messages/serverMessage';
import { handlerTemplate } from './templates';
import { ISendEmail } from './types';

// #endregion

// #region CONFIG
const transporter = createTransport({
  host: 'smtp.mail.us-west-2.awsapps.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

export class EmailTransporterServices {
  async sendEmail({ subject, toEmail, text, link, template }: ISendEmail) {
    const mail = {
      from: `${subject} <noreply@adalovelace.com.br>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      text,
      html: handlerTemplate({
        template,
        variables: {
          link,
          text,
          subject,
        },
      }),
    };

    transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }
}
