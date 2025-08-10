import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, List, ListItem, ListItemText, Button, 
  Typography, Box, IconButton, ListItemSecondaryAction 
} from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { loadForms, deleteForm, setCurrentForm } from '../../store/formSlice';
import { RootState } from '../../store/store';

const FormList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms } = useSelector((state: RootState) => state.formBuilder);

  useEffect(() => {
    dispatch(loadForms());
  }, [dispatch]);

  const handleCreateNew = () => {
    dispatch(setCurrentForm(null));
    navigate('/create');
  };

  const handleEdit = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      dispatch(setCurrentForm(form));
      navigate('/create');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        <Typography variant="h4">My Forms</Typography>
        <Button variant="contained" onClick={handleCreateNew}>
          Create New Form
        </Button>
      </Box>

      {forms.length === 0 ? (
        <Typography variant="body1">No forms saved yet</Typography>
      ) : (
        <List>
          {forms.map(form => (
            <ListItem key={form.id}>
              <ListItemText 
                primary={form.title} 
                secondary={`Created: ${formatDate(form.createdAt)} | Fields: ${form.fields.length}`} 
              />
              
              {/* In the list item */}
              <ListItemSecondaryAction>
                <IconButton onClick={() => navigate(`/preview/${form.id}`)}>
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => handleEdit(form.id)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => dispatch(deleteForm(form.id))}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default FormList;
