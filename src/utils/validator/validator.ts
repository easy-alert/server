/* eslint-disable valid-typeof */

// TYPES
import { IValidator, IValidatorCheck } from './types';

// SERVICES
import { ServerMessage } from '../messages/serverMessage';

export class Validator {
  check(Vars: IValidatorCheck[]) {
    for (let i = 0; i < Vars.length; i++) {
      if (
        !Vars[i].isOptional &&
        (Vars[i].variable === null || Vars[i].variable === undefined || Vars[i].variable === '')
      ) {
        throw new ServerMessage({
          statusCode: 400,
          message: `Verifique a informação: ${Vars[i].label} e tente novamente.`,
        });
      }

      if (Vars[i].variable && typeof Vars[i].variable !== Vars[i].type) {
        throw new ServerMessage({
          statusCode: 400,
          message: `Verifique o tipo da informação: ${Vars[i].label} e tente novamente.`,
        });
      }
    }
  }

  notNull(Vars: IValidator[]) {
    for (const variable of Vars) {
      if (!variable.variable) {
        throw new ServerMessage({
          statusCode: 400,
          message: `Verifique a informação: ${variable.label} e tente novamente.`,
        });
      }
    }
  }

  cannotExists(Vars: IValidator[]) {
    for (const variable of Vars) {
      if (variable.variable) {
        throw new ServerMessage({
          statusCode: 400,
          message: `A informação: ${variable.label} já existe na base de dados.`,
        });
      }
    }
  }

  needExist(Vars: IValidator[]) {
    for (const variable of Vars) {
      if (variable.variable === null || variable.variable === undefined) {
        throw new ServerMessage({
          statusCode: 404,
          message: `A informação: ${variable.label} não existe na base de dados.`,
        });
      }
    }
  }
}

export const validator = new Validator();
