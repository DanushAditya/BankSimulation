import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SpinnerProps {
  size?: number;
  fullPage?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 36, fullPage = false }) => {
  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: 300,
        }}
      >
        <CircularProgress size={size} />
      </Box>
    );
  }
  return <CircularProgress size={size} />;
};
