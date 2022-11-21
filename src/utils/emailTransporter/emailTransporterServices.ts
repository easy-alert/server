// #region IMPORTS
import { createTransport } from 'nodemailer';
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
      from: `Easy Alert - ${subject} <noreply@adalovelace.com.br>`,
      to: toEmail,
      subject,
      text,
      template,
      context: {
        link,
        text,
      },
    };

    transporter.sendMail(mail);
  }
}
