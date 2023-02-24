export interface ISendConfirmEmail {
  toEmail?: string;
  link: string;
  subject: string;
  text: string;
}

export interface ISendProofOfReport {
  toEmail?: string;
  subject: string;
  element: string;
  buildingName: string;
  reportDate: string;
  cost: number | string;
  categoryName: string;
  syndicName: string;
  activity: string;
  observation: string;
}
