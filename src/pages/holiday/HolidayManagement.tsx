import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import MainLayout from '../../layouts/MainLayout';
import { AppDispatch, RootState } from '../../app/store';
import {
  fetchHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  setSelectedHoliday,
  clearError,
  Holiday,
  CreateHolidayRequest,
  UpdateHolidayRequest,
} from '../../features/holiday';

interface HolidayFormData {
  name: string;
  date: string;
  type: 'national' | 'company' | 'regional';
  description: string;
  is_paid: boolean;
  is_active: boolean;
}

const HolidayManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { holidays, loading, error } = useSelector((state: RootState) => state.holiday);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState<HolidayFormData>({
    name: '',
    date: '',
    type: 'national',
    description: '',
    is_paid: true,
    is_active: true,
  });

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  const handleOpenDialog = (holiday?: Holiday) => {
    if (holiday) {
      setEditingHoliday(holiday);
      setFormData({
        name: holiday.name,
        date: holiday.date,
        type: holiday.type,
        description: holiday.description || '',
        is_paid: holiday.is_paid,
        is_active: holiday.is_active,
      });
    } else {
      setEditingHoliday(null);
      setFormData({
        name: '',
        date: '',
        type: 'national',
        description: '',
        is_paid: true,
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingHoliday(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.date) {
      return;
    }

    const submitData = {
      name: formData.name,
      date: formData.date,
      type: formData.type,
      description: formData.description,
      is_paid: formData.is_paid,
      is_active: formData.is_active,
    };

    try {
      if (editingHoliday) {
        await dispatch(updateHoliday({ id: editingHoliday.id, data: submitData })).unwrap();
      } else {
        await dispatch(createHoliday(submitData)).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving holiday:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('holiday.delete.confirm'))) {
      try {
        await dispatch(deleteHoliday(id)).unwrap();
      } catch (error) {
        console.error('Error deleting holiday:', error);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'national':
        return 'primary';
      case 'company':
        return 'secondary';
      case 'regional':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  if (loading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            {t('holiday.management.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('holiday.add')}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('holiday.table.name')}</TableCell>
                  <TableCell>{t('holiday.table.date')}</TableCell>
                  <TableCell>{t('holiday.table.type')}</TableCell>
                  <TableCell>{t('holiday.table.description')}</TableCell>
                  <TableCell>{t('holiday.table.is_paid')}</TableCell>
                  <TableCell>{t('holiday.table.status')}</TableCell>
                  <TableCell>{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holidays.map((holiday: Holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell>{holiday.name}</TableCell>
                    <TableCell>{format(new Date(holiday.date), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`holiday.type.${holiday.type}`)}
                        color={getTypeColor(holiday.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{holiday.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={holiday.is_paid ? t('common.yes') : t('common.no')}
                        color={holiday.is_paid ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={holiday.is_active ? t('common.active') : t('common.inactive')}
                        color={getStatusColor(holiday.is_active)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(holiday)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(holiday.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingHoliday ? t('holiday.edit.title') : t('holiday.add.title')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label={t('holiday.form.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label={t('holiday.form.date')}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('holiday.form.type')}</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  label={t('holiday.form.type')}
                >
                  <MenuItem value="national">{t('holiday.type.national')}</MenuItem>
                  <MenuItem value="company">{t('holiday.type.company')}</MenuItem>
                  <MenuItem value="regional">{t('holiday.type.regional')}</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label={t('holiday.form.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_paid}
                    onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
                  />
                }
                label={t('holiday.form.is_paid')}
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label={t('holiday.form.is_active')}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingHoliday ? t('common.update') : t('common.create')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default HolidayManagement; 