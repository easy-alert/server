import { ServerMessage } from '../messages/serverMessage';
import { INeedAndCannotExist } from './types';

export function cannotExist(vars: INeedAndCannotExist[]) {
  for (let i = 0; i < vars.length; i++) {
    if (vars[i].variable) {
      throw new ServerMessage({
        statusCode: 400,
        message: `A informação ${vars[i].label} já existe na base de dados.`,
      });
    }
  }
}
