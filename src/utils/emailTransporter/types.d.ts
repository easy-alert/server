export interface ISendEmail {
  toEmail: string;
  subject: string;
  text: string;
  link: string;
  template: 'confirmEmail';
}
