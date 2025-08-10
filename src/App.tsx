// ... other imports ...
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import FormBuilder from './components/FormBuilder';
import FormList from './components/FormList/FormList';
import FormPreview from './components/FormPreview/FormPreview';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Form Builder
            </Typography>
            <Button color="inherit" component={Link} to="/create">
              Create
            </Button>
            <Button color="inherit" component={Link} to="/myforms">
              My Forms
            </Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4, mb: 4 }}>
          <Routes>
            {/* Redirect root to /myforms */}
            <Route path="/" element={<Navigate to="/myforms" replace />} />
            <Route path="/create" element={<FormBuilder />} />
            <Route path="/myforms" element={<FormList />} />
            <Route path="/preview/:formId" element={<FormPreview />} />
          </Routes>
        </Container>
      </Router>
    </Provider>
  );
}

export default App;
