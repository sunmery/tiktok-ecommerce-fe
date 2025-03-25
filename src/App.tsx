import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import theme from './theme/theme';
import { AlertProvider } from './components/AlertProvider';
import './utils/i18n';

const App: React.FC = () => {
  return (
    <CssVarsProvider theme={theme} defaultMode="light">
      <CssBaseline />
      <AlertProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </AlertProvider>
    </CssVarsProvider>
  );
};

export default App
