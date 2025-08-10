import React from 'react';
import { Box, Button, Select, MenuItem, TextField, FormControl, InputLabel, IconButton, Typography } from '@mui/material';
import { ValidationRule, ValidationType, FieldType } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';

const validationTypes: ValidationType[] = [
  'required', 'minLength', 'maxLength', 'pattern', 'min', 'max'
];

interface ValidationRulesProps {
  rules: ValidationRule[];
  onChange: (rules: ValidationRule[]) => void;
  fieldType: FieldType;
}

const ValidationRules: React.FC<ValidationRulesProps> = ({ rules, onChange, fieldType }) => {
  const addRule = () => {
    onChange([...rules, { type: 'required', message: 'This field is required' }]);
  };

  const updateRule = (index: number, rule: ValidationRule) => {
    const newRules = [...rules];
    newRules[index] = rule;
    onChange(newRules);
  };

  const deleteRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Validation Rules
      </Typography>
      
      {rules.map((rule, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={rule.type}
              label="Type"
              onChange={(e) => updateRule(index, { ...rule, type: e.target.value as ValidationType })}
            >
              {validationTypes
                .filter(type => {
                  if (fieldType === 'number') return ['min', 'max'].includes(type);
                  if (fieldType === 'text' || fieldType === 'textarea') 
                    return ['minLength', 'maxLength', 'pattern'].includes(type);
                  return true;
                })
                .map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
            </Select>
          </FormControl>
          
          {rule.type !== 'required' && (
            <TextField
              label="Value"
              value={rule.value || ''}
              onChange={(e) => updateRule(index, { ...rule, value: e.target.value })}
              sx={{ flexGrow: 1 }}
            />
          )}
          
          <TextField
            label="Error Message"
            value={rule.message}
            onChange={(e) => updateRule(index, { ...rule, message: e.target.value })}
            sx={{ flexGrow: 2 }}
          />
          
          <IconButton onClick={() => deleteRule(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      
      <Button variant="outlined" onClick={addRule} sx={{ mt: 1 }}>
        Add Rule
      </Button>
    </Box>
  );
};

export default ValidationRules;