import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AccountCircleRounded as AccountCircleRoundedIcon } from '@mui/icons-material';
import { LockRounded as LockRoundedIcon } from '@mui/icons-material';
import { VisibilityRounded as VisibilityRoundedIcon } from '@mui/icons-material';
import { VisibilityOffRounded as VisibilityOffRoundedIcon } from '@mui/icons-material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { BoltRounded as BoltRoundedIcon } from '@mui/icons-material';
import { BarChartRounded as BarChartRoundedIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bankApi } from '../api/bankApi';
import { useAuthStore } from '../store/authStore';
import { YesBankLogo } from '../components/ui/YesBankLogo';

const FEATURES = [
  { icon: LockOutlinedIcon, title: '256-bit SSL Encryption', desc: 'Military-grade security for all transactions' },
  { icon: BoltRoundedIcon, title: 'Instant Transfers', desc: 'Send money anywhere in seconds, 24/7' },
  { icon: BarChartRoundedIcon, title: 'Real-time Analytics', desc: 'Track spending and balance trends live' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAdmin, setCustomer } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (username.trim() === 'admin' && password === 'admin123') {
        setAdmin();
        toast.success('Welcome, Administrator!');
        navigate('/admin/dashboard');
      } else {
        // Customer path — try fetching account by account number
        try {
          const account = await bankApi.getAccount(username.trim());
          setCustomer(account);
          toast.success(`Welcome back, ${account.name}!`);
          navigate('/customer/overview');
        } catch {
          setError('Account not found. Please check your account number and try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-page">
      {/* Left Panel */}
      <Box className="login-left">
        <Box className="deco-circle-1" aria-hidden="true" />
        <Box className="deco-circle-2" aria-hidden="true" />
        <Box className="deco-circle-3" aria-hidden="true" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '0.5rem' }}
        >
          <YesBankLogo white size="lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              textAlign: 'center',
              mb: 4,
              letterSpacing: '0.3px',
            }}
          >
            Experience Banking Excellence
          </Typography>
        </motion.div>

        {/* Feature Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', maxWidth: 340, zIndex: 1 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.45 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.6,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.8,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.20)',
                    color: '#fff',
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: 'rgba(255,255,255,0.20)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <f.icon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>{f.title}</Typography>
                    <Typography sx={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.68)' }}>{f.desc}</Typography>
                  </Box>
                </Box>
              </motion.div>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Right Panel */}
      <Box className="login-right">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <YesBankLogo size="md" />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 0.5 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 3 }}>
            Sign in to your YES BANK account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(37,99,235,0.10)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(37,99,235,0.10)',
              p: 3,
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                id="username"
                label="Username / Account Number"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                sx={{ mb: 2 }}
                inputProps={{ 'aria-required': 'true' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                id="password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                sx={{ mb: 1.5 }}
                inputProps={{ 'aria-required': 'true' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPass((p) => !p)}
                        edge="end"
                        aria-label={showPass ? 'Hide password' : 'Show password'}
                        size="small"
                      >
                        {showPass ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Remember me
                    </Typography>
                  }
                />
                <Typography
                  component="a"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => toast('Contact your branch for password reset.', { icon: 'ℹ️' })}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                loading={loading}
                size="large"
                aria-label="Sign In"
              >
                Sign In
              </LoadingButton>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 3,
              bgcolor: 'rgba(37,99,235,0.05)',
              border: '1px solid rgba(37,99,235,0.10)',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Inter', lineHeight: 1.8 }}>
              <strong>Admin:</strong> username <code>admin</code> / password <code>admin123</code>
              <br />
              <strong>Customer:</strong> Enter your 16-digit account number as username
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};
