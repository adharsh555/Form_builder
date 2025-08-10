import React, { useState, useEffect } from 'react';
import { 
  TextField, TextareaAutosize, FormControlLabel, Checkbox, Select, MenuItem, 
  FormControl, InputLabel, Button, Box, RadioGroup, Radio, Typography 
} from '@mui/material';
import { FormConfig, FormField } from '../../types';
import { validateField } from '../../utils/validation';

interface FormRendererProps {
  form: FormConfig;
  onSubmit: (values: Record<string, any>) => void;
  onCancel?: () => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ form, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form values
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    form.fields.forEach(field => {
      if (field.defaultValue) {
        initialValues[field.id] = field.defaultValue;
      } else {
        initialValues[field.id] = field.type === 'checkbox' ? false : '';
      }
    });
    setFormValues(initialValues);
  }, [form]);

  // Handle derived fields
  useEffect(() => {
    const derivedFields = form.fields.filter(f => f.isDerived);
    if (derivedFields.length === 0) return;

    const newValues = { ...formValues };
    let hasChanges = false;

    derivedFields.forEach(field => {
      if (!field.parentFields || !field.derivationLogic) return;
      
      try {
        const parentValues = field.parentFields.map(parentId => formValues[parentId]);
        const compute = new Function('values', `return ${field.derivationLogic}`);
        const result = compute(parentValues);
        
        if (newValues[field.id] !== result) {
          newValues[field.id] = result;
          hasChanges = true;
        }
      } catch (error) {
        console.error('Error computing derived field:', error);
      }
    });

    if (hasChanges) {
      setFormValues(newValues);
    }
  }, [formValues, form.fields]);

  const handleChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    form.fields.forEach(field => {
      if (field.isDerived) return; // Skip validation for derived fields
      
      const error = validateField(
        String(formValues[field.id] || ''), 
        field.validation
      );
      
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  const renderField = (field: FormField) => {
    if (field.isDerived) {
      return (
        <TextField
          key={field.id}
          label={field.label}
          value={formValues[field.id] || ''}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />
      );
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <TextField
            key={field.id}
            label={field.label}
            type={field.type === 'date' ? 'date' : field.type}
            required={field.required}
            placeholder={field.placeholder}
            value={formValues[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            error={!!errors[field.id]}
            helperText={errors[field.id]}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
          />
        );
      case 'textarea':
        return (
          <TextField
            key={field.id}
            label={field.label}
            multiline
            rows={4}
            required={field.required}
            placeholder={field.placeholder}
            value={formValues[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            error={!!errors[field.id]}
            helperText={errors[field.id]}
            fullWidth
            sx={{ mb: 2 }}
          />
        );
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                checked={!!formValues[field.id]}
                onChange={(e) => handleChange(field.id, e.target.checked)}
              />
            }
            label={field.label}
            sx={{ mb: 2 }}
          />
        );
      case 'select':
        return (
          <FormControl fullWidth key={field.id} sx={{ mb: 2 }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formValues[field.id] || ''}
              label={field.label}
              onChange={(e) => handleChange(field.id, e.target.value)}
            >
              {field.options?.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'radio':
        return (
          <FormControl fullWidth key={field.id} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{field.label}</Typography>
            <RadioGroup
              value={formValues[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            >
              {field.options?.map(option => (
                <FormControlLabel 
                  key={option} 
                  value={option} 
                  control={<Radio />} 
                  label={option} 
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        {form.title}
      </Typography>
      
      {form.fields.map(renderField)}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default FormRenderer;