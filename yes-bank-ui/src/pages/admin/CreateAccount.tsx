import React, { useState } from 'react';
import {
  Box, Typography, TextField, Alert,
  IconButton, Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ContentCopyRounded as ContentCopyRoundedIcon } from '@mui/icons-material';
import { CheckCircleRounded as CheckCircleRoundedIcon } from '@mui/icons-material';
import { PersonAddRounded as PersonAddRoundedIcon } from '@mui/icons-material';
import { RefreshRounded as RefreshRoundedIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { bankApi } from '../../api/bankApi';
import type { Account } from '../../types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CreateAccount: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!age || parseInt(age) < 18) e.age = 'Age must be 18 or older';
    if (!email || !emailRegex.test(email)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setError(null);
    try {
      const acc = await bankApi.createAccount({ name: name.trim(), age: parseInt(age), email: email.trim() });
      setCreated(acc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleReset = () => {
    setCreated(null); setName(''); setAge(''); setEmail('');
    setErrors({}); setError(null);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box
            sx={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(37,99,235,0.10)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(37,99,235,0.10)',
              p: 3.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(37,99,235,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonAddRoundedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Create New Account</Typography>
                <Typography variant="body2" color="text.secondary">Open a new YES BANK account</Typography>
              </Box>
            </Box>

            {!created ? (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>}
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  sx={{ mb: 2 }}
                  inputProps={{ 'aria-label': 'Full name' }}
                />
                <TextField
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  error={!!errors.age}
                  helperText={errors.age}
                  required
                  sx={{ mb: 2 }}
                  inputProps={{ min: 18, 'aria-label': 'Age' }}
                />
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  sx={{ mb: 3 }}
                  inputProps={{ 'aria-label': 'Email address' }}
                />
                <LoadingButton type="submit" variant="contained" fullWidth size="large" loading={loading} aria-label="Create Account">
                  Create Account
                </LoadingButton>
              </Box>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>Account Created!</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Welcome, {created.name}</Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: 'rgba(37,99,235,0.05)',
                    border: '1px solid rgba(37,99,235,0.15)',
                    borderRadius: 3,
                    p: 2,
                    mb: 2.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Account Number
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', color: 'primary.main', flex: 1 }}
                    >
                      {created.accountNumber}
                    </Typography>
                    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                      <IconButton onClick={handleCopy} size="small" aria-label="Copy account number">
                        <ContentCopyRoundedIcon sx={{ fontSize: 18, color: copied ? 'success.main' : 'text.secondary' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <LoadingButton
                  startIcon={<RefreshRoundedIcon />}
                  variant="outlined"
                  fullWidth
                  onClick={handleReset}
                  aria-label="Create another account"
                >
                  Create Another Account
                </LoadingButton>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};
