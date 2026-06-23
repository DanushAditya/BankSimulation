// YES BANK — Root App component
// Wires together MUI ThemeProvider, Toaster, and Router

import React, { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { buildTheme } from './theme';
import { useThemeStore } from './store/authStore';
import { AppRouter } from './router';

const App: React.FC = () => {
  const { darkMode } = useThemeStore();

  // Rebuild MUI theme when dark mode changes
  const theme = useMemo(() => buildTheme(darkMode), [darkMode]);

  // Sync data-theme attribute for CSS variables
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: darkMode ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(37,99,235,0.15)',
            borderRadius: '12px',
            color: darkMode ? '#F1F5F9' : '#0F172A',
            boxShadow: '0 8px 32px rgba(37,99,235,0.12)',
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 500,
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;
