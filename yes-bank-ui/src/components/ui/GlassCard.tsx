import React from 'react';
import { Card, type CardProps } from '@mui/material';
import { motion } from 'framer-motion';

interface GlassCardProps extends CardProps {
  children: React.ReactNode;
  animate?: boolean;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  animate = true,
  delay = 0,
  sx,
  ...props
}) => {
  const card = (
    <Card
      sx={{
        p: 3,
        height: '100%',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );

  if (!animate) return card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      style={{ height: '100%' }}
    >
      {card}
    </motion.div>
  );
};
