export interface IValidator {
  variable: any;
  label: string;
}

export interface IValidatorCheck {
  variable: any;
  label: string;
  type: 'string' | 'number' | 'boolean';
  isOptional?: boolean;
}
