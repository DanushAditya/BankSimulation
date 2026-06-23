import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AddCircleRounded as AddCircleRoundedIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bankApi } from '../../api/bankApi';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/format';

export const CustomerDeposit: React.FC = () => {
  const { account, updateAccount } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    const amtNum = parseFloat(amount);
    if (!amount || isNaN(amtNum) || amtNum <= 0) {
      setResult({ type: 'error', msg: 'Please enter a valid positive amount.' });
      return;
    }
    setLoading(true); setResult(null);
    try {
      const newBal = await bankApi.deposit(account.accountNumber, amtNum);
      updateAccount({ ...account, balance: newBal });
      toast.success(`Deposited ${formatCurrency(amtNum)} successfully!`);
      setResult({ type: 'success', msg: `Deposit successful! New balance: ${formatCurrency(newBal)}` });
      setAmount('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Deposit failed';
      setResult({ type: 'error', msg });
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 460 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(37,99,235,0.10)', borderRadius: 4, boxShadow: '0 8px 32px rgba(37,99,235,0.10)', p: 3.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#10B98118', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AddCircleRoundedIcon sx={{ color: '#10B981', fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Deposit Money</Typography>
                <Typography variant="body2" color="text.secondary">Add funds to your account</Typography>
              </Box>
            </Box>
            <Box component="form" onSubmit={handleDeposit} noValidate>
              <TextField
                label="Account Number"
                value={account?.accountNumber ?? ''}
                disabled
                sx={{ mb: 2 }}
                inputProps={{ readOnly: true, style: { fontFamily: 'monospace' } }}
              />
              <TextField
                label="Amount to Deposit"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>₹</Typography></InputAdornment> }}
                inputProps={{ min: 1, step: '0.01', 'aria-label': 'Deposit amount' }}
              />
              <LoadingButton type="submit" variant="contained" fullWidth size="large" loading={loading}
                sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' }, boxShadow: '0 4px 14px rgba(16,185,129,0.30)' }}
                aria-label="Deposit"
              >
                Deposit Now
              </LoadingButton>
            </Box>
            {result && (
              <Alert severity={result.type} sx={{ mt: 2, borderRadius: 2 }} onClose={() => setResult(null)}>{result.msg}</Alert>
            )}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};
