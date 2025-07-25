// #region IMPORTS
import { createTransport } from 'nodemailer';
import { ServerMessage } from '../messages/serverMessage';
import { EmailTemplates } from './templates/templates';
import type {
  INewBuildingCreated,
  INewCompanyCreated,
  ISendConfirmEmail,
  ISendProofOfReport,
  ISendRecoveryPassword,
  ITicketChangedStatus,
  ITicketCreated,
  ITicketDismissed,
  ITicketFinished,
} from './types';

// #endregion

const emailTemplates = new EmailTemplates();

// #region CONFIG
const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  tls: { rejectUnauthorized: false },
  auth: {
    user: process.env.GMAIL_NOREPLY_USER,
    pass: process.env.GMAIL_NOREPLY_APP_PASS,
  },
});

export class EmailTransporterServices {
  async sendConfirmEmail({ subject, toEmail, text, link, companyLogo }: ISendConfirmEmail) {
    const mail = {
      from: `${subject} <${process.env.GMAIL_NOREPLY_USER}>`,
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
      from: `${subject} <${process.env.GMAIL_NOREPLY_USER}>`,
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
      from: `${subject} <${process.env.GMAIL_NOREPLY_USER}>`,
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
      from: `${subject} <${process.env.GMAIL_NOREPLY_USER}>`,
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
      from: `${subject} <${process.env.GMAIL_NOREPLY_USER}>`,
      to: toEmail,
      subject: `Easy Alert - ${subject}`,
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
        attachments,
      }),
    };

    transporter.sendMail(mail);
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
      from: `Script de deletar manutenções utilizado <${process.env.GMAIL_NOREPLY_USER}>`,
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

  sendTicketCreated({
    toEmail,
    buildingName,
    residentName,
    responsibleName,
    ticketNumber,
    toWhom,
    link,
  }: ITicketCreated) {
    const sendEmail = {
      from: `Chamado aberto <${process.env.GMAIL_NOREPLY_USER}>`,
      to: toEmail,
      subject: `Easy Alert - Chamado aberto no ${buildingName}`,
      html: emailTemplates.ticketCreated({
        buildingName,
        residentName,
        responsibleName,
        ticketNumber,
        toWhom,
        link,
      }),
    };

    transporter.sendMail(sendEmail);
  }

  sendTicketStatusChanged({
    toEmail,
    ticketNumber,
    residentName,
    buildingName,
    statusName,
  }: ITicketChangedStatus) {
    const mail = {
      from: `Chamado atualizado <${process.env.GMAIL_NOREPLY_USER}>`,
      to: toEmail,
      subject: `Easy Alert - Chamado atualizado ${ticketNumber}`,
      html: emailTemplates.ticketChangedStatus({
        residentName,
        ticketNumber,
        buildingName,
        statusName,
      }),
    };

    transporter.sendMail(mail);
  }

  sendTicketDismissed({
    toEmail,
    residentName,
    ticketNumber,
    dismissObservation,
    dismissReason,
    dismissedBy,
  }: ITicketDismissed) {
    const mail = {
      from: `Chamado indeferido <${process.env.GMAIL_NOREPLY_USER}>`,
      to: toEmail,
      subject: `Easy Alert - Chamado indeferido ${ticketNumber}`,
      html: emailTemplates.ticketDismissed({
        residentName,
        ticketNumber,
        dismissReason,
        dismissObservation,
        dismissedBy,
      }),
    };

    transporter.sendMail(mail);
  }

  sendTicketFinished({ toEmail, residentName, ticketNumber }: ITicketFinished) {
    const mail = {
      from: `Chamado finalizado <${process.env.GMAIL_NOREPLY_USER}>`,
      to: toEmail,
      subject: `Easy Alert - Chamado finalizado ${ticketNumber}`,
      html: emailTemplates.ticketFinished({
        residentName,
        ticketNumber,
      }),
    };

    transporter.sendMail(mail);
  }
}
