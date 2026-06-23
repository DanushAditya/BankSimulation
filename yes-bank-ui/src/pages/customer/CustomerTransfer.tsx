import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SwapHorizRounded as SwapHorizRoundedIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bankApi } from '../../api/bankApi';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/format';

export const CustomerTransfer: React.FC = () => {
  const { account } = useAuthStore();
  const [toAcn, setToAcn] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!toAcn.trim()) e.toAcn = 'Enter the recipient account number';
    else if (toAcn.trim() === account?.accountNumber) e.toAcn = 'Cannot transfer to your own account';
    const amtNum = parseFloat(amount);
    if (!amount || isNaN(amtNum) || amtNum <= 0) e.amount = 'Enter a valid positive amount';
    else if (account && amtNum > account.balance) e.amount = `Insufficient balance. Available: ${formatCurrency(account.balance)}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !validate()) return;
    setLoading(true); setResult(null);
    try {
      const msg = await bankApi.transfer(account.accountNumber, toAcn.trim(), parseFloat(amount));
      toast.success('Transfer successful!');
      setResult({ type: 'success', msg: `${msg || 'Transfer successful!'} — ₹${parseFloat(amount).toLocaleString('en-IN')} sent to account ending in ...${toAcn.slice(-4)}` });
      setToAcn(''); setAmount('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transfer failed';
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
              <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(37,99,235,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SwapHorizRoundedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Transfer Money</Typography>
                <Typography variant="body2" color="text.secondary">Send funds to another account</Typography>
              </Box>
            </Box>
            <Box component="form" onSubmit={handleTransfer} noValidate>
              <TextField 
                label="From Account" 
                value={account?.accountNumber ?? ''} 
                disabled 
                sx={{ mb: 2 }} 
                inputProps={{ readOnly: true, style: { fontFamily: 'monospace' } }} 
              />
              <TextField
                label="To Account Number"
                value={toAcn}
                onChange={(e) => setToAcn(e.target.value)}
                required
                error={!!errors.toAcn}
                helperText={errors.toAcn}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 20, 'aria-label': 'Recipient account number' }}
              />
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                error={!!errors.amount}
                helperText={errors.amount || (account ? `Balance: ${formatCurrency(account.balance)}` : '')}
                sx={{ mb: 3 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>₹</Typography></InputAdornment> }}
                inputProps={{ min: 1, step: '0.01', 'aria-label': 'Transfer amount' }}
              />
              <LoadingButton type="submit" variant="contained" fullWidth size="large" loading={loading} aria-label="Send Transfer">
                Send Transfer
              </LoadingButton>
            </Box>
            {result && <Alert severity={result.type} sx={{ mt: 2, borderRadius: 2 }} onClose={() => setResult(null)}>{result.msg}</Alert>}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};
