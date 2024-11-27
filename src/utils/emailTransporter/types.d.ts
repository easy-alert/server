export interface ISendConfirmEmail {
  toEmail?: string;
  companyLogo: string;
  link: string;
  subject: string;
  text: string;
}

export interface ISendRecoveryPassword {
  toEmail?: string;
  link: string;
  subject: string;
  text: string;
}

export interface INewCompanyCreated {
  toEmail?: string;
  companyName: string;
  subject: string;
}

export interface INewBuildingCreated {
  toEmail?: string;
  companyName: string;
  buildingName: string;
  subject: string;
}

export interface ISendProofOfReport {
  toEmail?: string;
  attachments?: {
    filename: string;
    path: string;
  }[];
  companyLogo: string;
  subject: string;
  element: string;
  buildingName: string;
  resolutionDate: string;
  cost: number | string;
  categoryName: string;
  responsible: string;
  source: string;
  maintenanceObservation: string;
  notificationDate: string;
  dueDate: string;
  syndicName: string;
  activity: string;
  reportObservation: string;
}

export interface ITicketCreated {
  toEmail?: string;
  buildingName: string;
  residentName?: string;
  responsibleName?: string;
  ticketNumber: number;
  toWhom: 'resident' | 'responsible';
  link?: string;
}

export interface ITicketChangedStatus {
  toEmail?: string;
  ticketNumber: number;
  residentName: string;
  buildingName: string;
  statusName: string;
}

export interface ITicketDismissed {
  toEmail?: string;
  ticketNumber: number;
  residentName: string;
  dismissReason: string;
  dismissObservation: string;
  dismissedBy: string;
}

export interface ITicketFinished {
  toEmail?: string;
  residentName: string;
  ticketNumber: number;
}
