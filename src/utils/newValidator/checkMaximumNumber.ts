import { ServerMessage } from '../messages/serverMessage';

interface ICheckMaximumNumber {
  value: number;
  max: number;
  label: string;
}

export function checkMaximumNumber(vars: ICheckMaximumNumber[]) {
  for (let i = 0; i < vars.length; i++) {
    if (vars[i].value !== null && vars[i].value !== undefined && vars[i].value > vars[i].max) {
      throw new ServerMessage({
        statusCode: 400,
        message: `A informação ${vars[i].label} deve ser menor ou igual a ${vars[i].max}.`,
      });
    }
  }
}
