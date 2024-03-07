import { ServerMessage } from '../messages/serverMessage';

export function checkNaN(NumberList: { number: any; label: string }[]) {
  for (const { number, label } of NumberList) {
    if (number && Number.isNaN(Number(number))) {
      throw new ServerMessage({
        statusCode: 400,
        message: `A informação ${label} deve ser um número.`,
      });
    }
  }
}
