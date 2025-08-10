import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { FormConfig, FormField } from '../../types';
import { validateField as validateRules } from '../../utils/validation'; // adjust path if needed

interface PreviewModalProps {
  form: FormConfig;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ form, onClose }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));

    // Clear error if it exists
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    form.fields.forEach(field => {
      const errorMsg = validateRules(
        formValues[field.id] ?? '',
        field.validation || []
      );
      if (errorMsg) {
        newErrors[field.id] = errorMsg;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('Form submitted successfully!\n' + JSON.stringify(formValues, null, 2));
    onClose();
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <TextField
            key={field.id}
            label={field.label}
            type={field.type}
            required={!!field.validation?.some(v => v.type === 'required')}
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
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Preview: {form.title}
        </Typography>

        <Box sx={{ display: 'grid', gap: 2 }}>
          {form.fields.map(renderField)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PreviewModal;
