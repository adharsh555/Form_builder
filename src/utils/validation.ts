export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value?: string | number;
  message: string;
};

export const validateField = (value: string, rules: ValidationRule[] = []) => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value.trim()) return rule.message;
        break;
      case 'minLength':
        if (value.length < Number(rule.value)) return rule.message;
        break;
      case 'maxLength':
        if (value.length > Number(rule.value)) return rule.message;
        break;
      case 'pattern':
        const regex = new RegExp(rule.value as string);
        if (!regex.test(value)) return rule.message;
        break;
      case 'min':
        if (Number(value) < Number(rule.value)) return rule.message;
        break;
      case 'max':
        if (Number(value) > Number(rule.value)) return rule.message;
        break;
    }
  }
  return '';
};

// Custom password validation
export const passwordValidation: ValidationRule[] = [
  {
    type: 'minLength',
    value: 8,
    message: 'Password must be at least 8 characters'
  },
  {
    type: 'pattern',
    value: '.*\\d.*',
    message: 'Password must contain at least one number'
  }
];

// Email validation
export const emailValidation: ValidationRule[] = [
  {
    type: 'pattern',
    value: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    message: 'Invalid email format'
  }
];