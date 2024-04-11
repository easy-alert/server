// #region IMPORTS
import { createTransport } from 'nodemailer';
import { ServerMessage } from '../messages/serverMessage';
import { EmailTemplates } from './templates/templates';
import {
  INewBuildingCreated,
  INewCompanyCreated,
  ISendConfirmEmail,
  ISendProofOfReport,
  ISendRecoveryPassword,
  ITicketCreated,
  ITicketFinished,
} from './types';

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
  async sendConfirmEmail({ subject, toEmail, text, link, companyLogo }: ISendConfirmEmail) {
    const mail = {
      from: `${subject} <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      text,
      html: emailTemplates.confirmEmail({
        link,
        text,
        subject,
        companyLogo,
      }),
    };

    await transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }

  async sendRecoveryPasswordEmail({ subject, toEmail, text, link }: ISendRecoveryPassword) {
    const mail = {
      from: `${subject} <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      text,
      html: emailTemplates.recoveryPassword({
        link,
        text,
        subject,
      }),
    };

    await transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }

  async sendNewCompanyCreated({ companyName, subject, toEmail }: INewCompanyCreated) {
    const mail = {
      from: `${subject} <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      html: emailTemplates.newCompanyCreated({
        companyName,
        subject,
      }),
    };

    await transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }

  async sendNewBuildingCreated({
    companyName,
    subject,
    toEmail,
    buildingName,
  }: INewBuildingCreated) {
    const mail = {
      from: `${subject} <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      html: emailTemplates.newBuildingCreated({
        companyName,
        subject,
        buildingName,
      }),
    };

    await transporter.sendMail(mail).catch(() => {
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
    companyLogo,
  }: ISendProofOfReport) {
    const mail = {
      from: `${subject} <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
      attachments,
      html: emailTemplates.proofOfReport({
        companyLogo,
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

  async sendDeleteMaintenanceScriptUsed({
    data,
    route,
    toEmail,
    buildingName,
  }: {
    data: string[];
    route: 'todas manutenções expiradas' | 'uma manutenção vencida';
    toEmail: string[];
    buildingName: string;
  }) {
    const mail = {
      from: `Script de deletar manutenções utilizado <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - Script de deletar manutenções utilizado`,
      html: emailTemplates.deleteMaintenanceScriptUsed({
        data,
        route,
        buildingName,
      }),
    };

    await transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }

  async sendTicketCreated({ toEmail, buildingName, residentName, ticketNumber }: ITicketCreated) {
    const mail = {
      from: `Chamado aberto <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - Chamado aberto`,
      html: emailTemplates.ticketCreated({
        buildingName,
        residentName,
        ticketNumber,
      }),
    };

    await transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }

  async sendTicketFinished({ toEmail, residentName, ticketNumber }: ITicketFinished) {
    const mail = {
      from: `Chamado finalizado <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: `Easy Alert - Chamado finalizado`,
      html: emailTemplates.ticketFinished({
        residentName,
        ticketNumber,
      }),
    };

    await transporter.sendMail(mail).catch(() => {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Oops! Encontramos um problema ao enviar a confirmação de email.',
      });
    });
  }
}
