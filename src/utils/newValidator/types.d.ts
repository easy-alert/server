type IType =
  | 'string'
  | 'int'
  | 'float'
  | 'boolean'
  | 'date'
  | 'json'
  | 'array'
  | 'time'
  | 'email'
  | 'CEP'
  | 'CPF'
  | 'CNPJ';

export interface ICheckValues {
  value: any;
  label: string;
  type: IType;
  required?: boolean;
  allowZero?: boolean;
}

export interface INeedAndCannotExist {
  label: string;
  variable: any;
}
