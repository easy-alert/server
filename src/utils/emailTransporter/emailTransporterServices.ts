// #region IMPORTS
import { createTransport } from 'nodemailer';
import { ServerMessage } from '../messages/serverMessage';
import { ISendEmail } from './types';

const path = require('path');
const hbs = require('nodemailer-express-handlebars');

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
const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve(__dirname, 'views'),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, 'views'),
  extName: '.hbs',
};
transporter.use('compile', hbs(handlebarOptions));
// #endregion

export class EmailTransporterServices {
  async sendEmail({ subject, toEmail, text, link, template }: ISendEmail) {
    const mail = {
      from: `${subject} <noreply@adalovelace.com.br>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      text,
      template,
      context: {
        link,
        text,
        subject,
      },
    };

    await transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }
}
