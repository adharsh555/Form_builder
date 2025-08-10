import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import FormRenderer from '../shared/FormRenderer';
import { loadForms } from '../../store/formSlice';

const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { forms } = useSelector((state: RootState) => state.formBuilder);
  // If loading is part of another slice or not present, set it to false or get it from the correct place
  const loading = false; // Replace with actual loading state if available

  useEffect(() => {
    if (forms.length === 0) {
      dispatch(loadForms());
    }
  }, [dispatch, forms.length]);

  const form = forms.find(f => f.id === formId);

  useEffect(() => {
    if (!loading && !form) {
      navigate('/myforms');
    }
  }, [form, loading, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!form) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Form not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/myforms')}>
          Back to My Forms
        </Button>
      </Box>
    );
  }

  const handleSubmit = (values: Record<string, any>) => {
    alert('Form submitted successfully!\n' + JSON.stringify(values, null, 2));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="outlined"
        onClick={() => navigate('/myforms')}
        sx={{ mb: 2 }}
      >
        Back to My Forms
      </Button>

      <Typography variant="h5" sx={{ mb: 2 }}>
        {form.title || 'Untitled Form'}
      </Typography>

      <FormRenderer form={form} onSubmit={handleSubmit} />
    </Box>
  );
};

export default FormPreview;
