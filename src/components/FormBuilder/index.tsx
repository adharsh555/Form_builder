import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Button, TextField, Typography, Box, Paper, Dialog, 
  DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import FieldConfigurator from './FieldConfigurator';
import { addForm, setCurrentForm, updateField, addField, deleteField, moveField } from '../../store/formSlice';
import { RootState } from '../../store/store';
import { FormField, FormConfig } from '../../types';
import FormRenderer from '../shared/FormRenderer';

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formTitle, setFormTitle] = useState('');

  useEffect(() => {
    if (currentForm) {
      setFormTitle(currentForm.title);
    } else {
      const newFormId = uuidv4();
      dispatch(setCurrentForm({
        id: newFormId,
        title: 'Untitled Form',
        fields: [],
        createdAt: new Date().toISOString()
      }));
    }
  }, [dispatch, currentForm]);

  const handleAddField = () => {
    const newField: FormField = {
      id: uuidv4(),
      name: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    dispatch(addField(newField));
  };

  const handleSaveForm = () => {
    if (!currentForm) return;
    
    const formToSave: FormConfig = {
      ...currentForm,
      title: formTitle,
      createdAt: new Date().toISOString() // Ensure creation date is set
    };

    dispatch(addForm(formToSave));
    setShowSaveDialog(false);
    navigate('/myforms');
  };

  return (
    <Container>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4">
          {currentForm?.id ? 'Edit Form' : 'Create New Form'}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Button variant="outlined" onClick={() => setShowPreview(true)}>
            Preview
          </Button>
          <Button variant="contained" onClick={() => setShowSaveDialog(true)}>
            Save Form
          </Button>
        </Box>
      </Box>

      <TextField
        label="Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Form Fields
        </Typography>
        
        {currentForm?.fields.map((field, index) => (
          <FieldConfigurator
            key={field.id}
            field={field}
            index={index}
            allFields={currentForm.fields}
            onChange={(updatedField) => 
              dispatch(updateField({ index, field: updatedField }))
            }
            onDelete={() => dispatch(deleteField(index))}
            onMove={(direction) => 
              dispatch(moveField({ index, direction }))
            }
          />
        ))}

        <Button 
          variant="outlined" 
          onClick={handleAddField}
          sx={{ mt: 2 }}
        >
          Add Field
        </Button>
      </Paper>

      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {showPreview && currentForm && (
        <Dialog 
          open={showPreview} 
          onClose={() => setShowPreview(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Preview: {currentForm.title}</DialogTitle>
          <DialogContent>
            <FormRenderer 
              form={currentForm} 
              onSubmit={(values) => {
                alert('Form submitted successfully!\n' + JSON.stringify(values, null, 2));
                setShowPreview(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default FormBuilder;
