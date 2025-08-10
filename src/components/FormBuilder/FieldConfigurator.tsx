import React from 'react';
import { 
  TextField, Select, MenuItem, InputLabel, FormControl, Button, Checkbox, 
  FormControlLabel, Box, Typography, TextareaAutosize, IconButton, RadioGroup, 
  Radio, FormLabel, FormGroup, Grid 
} from '@mui/material';
import { FormField, FieldType } from '../../types';
import ValidationRules from '../shared/ValidationRules';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface FieldConfiguratorProps {
  field: FormField;
  index: number;
  allFields: FormField[];
  onChange: (field: FormField) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

const FieldConfigurator: React.FC<FieldConfiguratorProps> = ({ 
  field, index, allFields, onChange, onDelete, onMove 
}) => {
  const handleChange = (prop: keyof FormField, value: any) => {
    onChange({ ...field, [prop]: value });
  };

  const toggleDerived = () => {
    if (field.isDerived) {
      onChange({ 
        ...field, 
        isDerived: false,
        parentFields: undefined,
        derivationLogic: undefined
      });
    } else {
      onChange({ 
        ...field, 
        isDerived: true,
        defaultValue: undefined,
        validation: undefined
      });
    }
  };

  const toggleParentField = (parentId: string) => {
    const currentParents = field.parentFields || [];
    const newParents = currentParents.includes(parentId)
      ? currentParents.filter(id => id !== parentId)
      : [...currentParents, parentId];
    
    onChange({ ...field, parentFields: newParents });
  };

  return (
    <Box sx={{ p: 2, mb: 2, border: '1px solid #ddd', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1">
          {field.label || 'New Field'} ({field.type})
        </Typography>
        <Box>
          <IconButton onClick={() => onMove('up')} disabled={index === 0}>
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton onClick={() => onMove('down')} disabled={index === allFields.length - 1}>
            <ArrowDownwardIcon />
          </IconButton>
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          label="Field Name"
          value={field.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
        />
        <TextField
          label="Label"
          value={field.label}
          onChange={(e) => handleChange('label', e.target.value)}
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={field.type}
            label="Type"
            onChange={(e) => handleChange('type', e.target.value as FieldType)}
          >
            {['text', 'number', 'email', 'textarea', 'select', 'radio', 'checkbox', 'date'].map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={field.required}
              onChange={(e) => handleChange('required', e.target.checked)}
            />
          }
          label="Required"
          sx={{ alignSelf: 'center' }}
        />
      </Box>

      {(field.type === 'select' || field.type === 'radio') && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Options (comma separated)"
            value={field.options?.join(',') || ''}
            onChange={(e) => handleChange('options', e.target.value.split(','))}
            fullWidth
          />
        </Box>
      )}

      {!field.isDerived && (
        <TextField
          label="Default Value"
          value={field.defaultValue || ''}
          onChange={(e) => handleChange('defaultValue', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
      )}

      {['text', 'email', 'textarea'].includes(field.type) && (
        <TextField
          label="Placeholder"
          value={field.placeholder || ''}
          onChange={(e) => handleChange('placeholder', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={field.isDerived || false}
            onChange={toggleDerived}
          />
        }
        label="Derived Field"
        sx={{ mb: 2 }}
      />

      {field.isDerived && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Parent Fields
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {allFields
              .filter(f => f.id !== field.id && !f.isDerived)
              .map(parent => (
                <Button
                  key={parent.id}
                  variant={field.parentFields?.includes(parent.id) ? 'contained' : 'outlined'}
                  onClick={() => toggleParentField(parent.id)}
                >
                  {parent.label}
                </Button>
              ))}
          </Box>

          <TextField
            label="Derivation Logic"
            placeholder="e.g., values[0] + values[1]"
            value={field.derivationLogic || ''}
            onChange={(e) => handleChange('derivationLogic', e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            helperText="Use 'values' array for parent fields in order selected"
          />
        </Box>
      )}

      {!field.isDerived && (
        <ValidationRules
          rules={field.validation || []}
          onChange={(rules) => handleChange('validation', rules)}
          fieldType={field.type}
        />
      )}
    </Box>
  );
};

export default FieldConfigurator;