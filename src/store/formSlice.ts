import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormConfig, FormField } from '../types';

const initialState: {
  forms: FormConfig[];
  currentForm: FormConfig | null;
  loading: boolean; // Add loading state
} = {
  forms: [],
  currentForm: null,
  loading: true, // Initial loading state
};

const formSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormConfig>) => {
      state.forms.push(action.payload);
      localStorage.setItem('forms', JSON.stringify(state.forms));
    },
    updateForm: (state, action: PayloadAction<FormConfig>) => {
      const index = state.forms.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = action.payload;
        localStorage.setItem('forms', JSON.stringify(state.forms));
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(f => f.id !== action.payload);
      localStorage.setItem('forms', JSON.stringify(state.forms));
    },
    setCurrentForm: (state, action: PayloadAction<FormConfig | null>) => {
      state.currentForm = action.payload;
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
      }
    },
    updateField: (state, action: PayloadAction<{ index: number; field: FormField }>) => {
      if (state.currentForm) {
        state.currentForm.fields[action.payload.index] = action.payload.field;
      }
    },
    deleteField: (state, action: PayloadAction<number>) => {
      if (state.currentForm) {
        state.currentForm.fields.splice(action.payload, 1);
      }
    },
    moveField: (state, action: PayloadAction<{ index: number; direction: 'up' | 'down' }>) => {
      if (state.currentForm) {
        const { index, direction } = action.payload;
        const fields = [...state.currentForm.fields];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < fields.length) {
          [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]];
          state.currentForm.fields = fields;
        }
      }
    },
    loadForms: (state) => {
      const savedForms = localStorage.getItem('forms');
      if (savedForms) {
        state.forms = JSON.parse(savedForms);
      }
      state.loading = false; // Set loading to false after loading
    },
  },
});

export const {
  addForm,
  updateForm,
  deleteForm,
  setCurrentForm,
  addField,
  updateField,
  deleteField,
  moveField,
  loadForms,
} = formSlice.actions;

export default formSlice.reducer;
