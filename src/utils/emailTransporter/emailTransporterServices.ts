// #region IMPORTS
import { createTransport } from 'nodemailer';
import { ServerMessage } from '../messages/serverMessage';
import { EmailTemplates } from './templates/templates';
import { ISendConfirmEmail, ISendProofOfReport } from './types';

// #endregion

const emailTemplates = new EmailTemplates();

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
  async sendConfirmEmail({ subject, toEmail, text, link }: ISendConfirmEmail) {
    const mail = {
      from: `${subject} <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      text,
      html: emailTemplates.confirmEmail({
        link,
        text,
        subject,
      }),
    };

    transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }

  async sendProofOfReport({
    activity,
    buildingName,
    categoryName,
    cost,
    reportObservation,
    resolutionDate,
    element,
    syndicName,
    subject,
    toEmail,
    attachments,
    dueDate,
    maintenanceObservation,
    notificationDate,
    responsible,
    source,
  }: ISendProofOfReport) {
    const mail = {
      from: `${subject} <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      attachments,
      html: emailTemplates.proofOfReport({
        activity,
        buildingName,
        categoryName,
        cost,
        reportObservation,
        resolutionDate,
        element,
        syndicName,
        toEmail,
        subject,
        dueDate,
        maintenanceObservation,
        notificationDate,
        responsible,
        source,
      }),
    };

    transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar o comprovante de relato por email.',
      });
    });
  }
}
