export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export type ValidationType = 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';

export interface ValidationRule {
  type: ValidationType;
  value?: string | number;
  message: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  defaultValue?: string;
  options?: string[];
  placeholder?: string;
  validation?: ValidationRule[];
  isDerived?: boolean;
  parentFields?: string[];
  derivationLogic?: string;
}

export interface FormConfig {
  id: string;
  title: string;
  fields: FormField[];
  createdAt: string;
}