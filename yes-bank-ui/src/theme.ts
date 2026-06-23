// YES BANK — MUI v5 Custom Theme
// Overrides all defaults so nothing looks like generic Material UI

import { createTheme, type Theme } from '@mui/material/styles';
import type {} from '@mui/lab/themeAugmentation';

export function buildTheme(dark: boolean): Theme {
  return createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: {
        main: '#2563EB',
        dark: '#1D4ED8',
        light: '#3B82F6',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#60A5FA',
        contrastText: '#ffffff',
      },
      background: {
        default: dark ? '#0F172A' : '#EEF5FF',
        paper: dark ? 'rgba(30, 41, 59, 0.80)' : 'rgba(255,255,255,0.72)',
      },
      success: { main: '#10B981', light: '#D1FAE5', dark: '#059669' },
      warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
      error: { main: '#EF4444', light: '#FEE2E2', dark: '#DC2626' },
      text: {
        primary: dark ? '#F1F5F9' : '#0F172A',
        secondary: dark ? '#94A3B8' : '#475569',
      },
      divider: dark ? 'rgba(96,165,250,0.12)' : 'rgba(37,99,235,0.10)',
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.03em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 600, letterSpacing: '-0.01em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' },
      body1: { fontWeight: 400, lineHeight: 1.6 },
      body2: { fontWeight: 400, lineHeight: 1.5 },
      caption: { fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '0.8rem' },
      button: { fontWeight: 600, letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 16 },
    shadows: [
      'none',
      '0 2px 8px rgba(37,99,235,0.06)',
      '0 4px 16px rgba(37,99,235,0.08)',
      '0 8px 32px rgba(37,99,235,0.10)',
      '0 12px 40px rgba(37,99,235,0.12)',
      '0 16px 48px rgba(37,99,235,0.14)',
      '0 20px 60px rgba(37,99,235,0.16)',
      '0 24px 64px rgba(37,99,235,0.18)',
      ...Array(17).fill('none') as string[],
    ] as Theme['shadows'],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: dark
              ? 'radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(96,165,250,0.04) 0%, transparent 50%)'
              : 'radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(96,165,250,0.06) 0%, transparent 50%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: dark ? 'rgba(30, 41, 59, 0.80)' : 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: dark ? '1px solid rgba(96,165,250,0.12)' : '1px solid rgba(37,99,235,0.10)',
            boxShadow: '0 8px 32px rgba(37,99,235,0.08)',
            transition: 'all 0.25s ease',
            '&:hover': {
              boxShadow: '0 20px 60px rgba(37,99,235,0.14)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: dark ? 'rgba(30, 41, 59, 0.90)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            fontSize: '0.925rem',
          },
          outlinedPrimary: {
            borderWidth: '1.5px',
            '&:hover': { borderWidth: '1.5px' },
          },
        },
      },
      MuiLoadingButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', fullWidth: true },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              background: dark ? 'rgba(15,23,42,0.40)' : 'rgba(255,255,255,0.60)',
              transition: 'background 0.2s',
              '&:hover': {
                background: dark ? 'rgba(15,23,42,0.60)' : 'rgba(255,255,255,0.80)',
              },
              '&.Mui-focused': {
                background: dark ? 'rgba(15,23,42,0.70)' : '#ffffff',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563EB',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563EB',
                borderWidth: '2px',
              },
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              background: dark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.05)',
              fontWeight: 700,
              color: '#2563EB',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              borderBottom: 'none',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: dark ? 'rgba(96,165,250,0.08)' : 'rgba(37,99,235,0.07)',
            padding: '14px 16px',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background 0.15s',
            '&:hover': {
              background: dark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.03)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '0.72rem',
            height: 26,
            letterSpacing: '0.02em',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            margin: '2px 8px',
            transition: 'all 0.2s ease',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px !important',
            padding: '6px 16px',
            fontSize: '0.82rem',
            border: '1.5px solid rgba(37,99,235,0.18) !important',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 700,
          },
        },
      },
    },
  });
}
