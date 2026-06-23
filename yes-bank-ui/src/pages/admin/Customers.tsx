import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Skeleton,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Drawer,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { SearchRounded as SearchRoundedIcon } from '@mui/icons-material';
import { VisibilityRounded as VisibilityRoundedIcon } from '@mui/icons-material';
import { DeleteRounded as DeleteRoundedIcon } from '@mui/icons-material';
import { CloseRounded as CloseRoundedIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bankApi } from '../../api/bankApi';
import type { Account, Transaction } from '../../types';
import { formatCurrency, formatDate, maskAccount, getInitials } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { GlassCard } from '../../components/ui/GlassCard';

export const Customers: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [drawerAccount, setDrawerAccount] = useState<Account | null>(null);
  const [drawerTxns, setDrawerTxns] = useState<Transaction[]>([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bankApi.getAllAccounts();
      setAccounts(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load accounts';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.accountNumber.includes(search) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleViewAccount = async (acc: Account) => {
    setDrawerAccount(acc);
    setDrawerLoading(true);
    try {
      const txns = await bankApi.getHistory(acc.accountNumber);
      setDrawerTxns(txns.slice(0, 5));
    } catch {
      setDrawerTxns([]);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bankApi.deleteAccount(deleteTarget.accountNumber);
      toast.success('Account deleted successfully');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <GlassCard delay={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>All Customers</Typography>
          <TextField
            placeholder="Search by name, account no, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            size="small"
            sx={{ maxWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={load} size="small">Retry</Button>}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Account No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : paginated.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                          {search ? 'No accounts match your search.' : 'No accounts found.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                : paginated.map((acc, i) => (
                    <motion.tr
                      key={acc.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', letterSpacing: '0.03em' }}>
                        {maskAccount(acc.accountNumber)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{acc.name}</TableCell>
                      <TableCell>{acc.age}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{acc.email}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatCurrency(acc.balance)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => handleViewAccount(acc)} aria-label={`View account ${acc.name}`}>
                            <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete account">
                          <IconButton size="small" color="error" onClick={() => setDeleteTarget(acc)} aria-label={`Delete account ${acc.name}`}>
                            <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </GlassCard>

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(drawerAccount)}
        onClose={() => setDrawerAccount(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3 } }}
      >
        {drawerAccount && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Account Details</Typography>
              <IconButton onClick={() => setDrawerAccount(null)} aria-label="Close drawer"><CloseRoundedIcon /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 800, fontSize: '1.2rem' }}>
                {getInitials(drawerAccount.name)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{drawerAccount.name}</Typography>
                <Typography variant="body2" color="text.secondary">{drawerAccount.email}</Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List dense disablePadding>
              {[
                { label: 'Account Number', value: drawerAccount.accountNumber, mono: true },
                { label: 'Age', value: `${drawerAccount.age} years` },
                { label: 'Balance', value: formatCurrency(drawerAccount.balance), bold: true, color: 'primary.main' },
              ].map((row) => (
                <ListItem key={row.label} disableGutters sx={{ py: 0.8 }}>
                  <ListItemText
                    primary={row.label}
                    secondary={row.value}
                    primaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary',
                      sx: { fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        fontWeight: row.bold ? 700 : 500,
                        color: row.color ?? 'text.primary',
                        fontFamily: row.mono ? 'monospace' : undefined,
                        fontSize: '0.92rem',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Recent Transactions</Typography>
            {drawerLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 0.5, borderRadius: 2 }} />)
            ) : drawerTxns.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>No transactions</Typography>
            ) : (
              drawerTxns.map((t) => (
                <Box
                  key={t.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    px: 1.5,
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: 'rgba(37,99,235,0.04)',
                  }}
                >
                  <Box>
                    <Badge type={t.transactionType} />
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.3 }}>
                      {formatDate(t.timestamp)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: t.transactionType === 'DEPOSIT' ? 'success.main' : 'error.main',
                    }}
                  >
                    {t.transactionType === 'DEPOSIT' ? '+' : '-'}{formatCurrency(t.amount)}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        )}
      </Drawer>

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the account for <strong>{deleteTarget?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteTarget(null)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
