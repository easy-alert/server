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
