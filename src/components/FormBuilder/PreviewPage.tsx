import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Box, Button, Typography } from '@mui/material';
import FormRenderer from '../shared/FormRenderer';

const PreviewPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const form = useSelector((state: RootState) => 
    state.formBuilder.forms.find(f => f.id === formId)
  );

  useEffect(() => {
    if (!form) {
      navigate('/');
    }
  }, [form, navigate]);

  if (!form) {
    return <Typography>Form not found</Typography>;
  }

  const handleSubmit = (values: Record<string, any>) => {
    alert('Form submitted successfully!\n' + JSON.stringify(values, null, 2));
    navigate('/');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {form.title}
      </Typography>
      <FormRenderer 
        form={form} 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/')}
      />
    </Box>
  );
};

export default PreviewPage;