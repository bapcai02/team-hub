import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '../../app/store';
import {
  fetchGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  searchGuests,
  getGuestsByType,
  getGuestsByStatus,
  setSelectedGuest,
  clearError,
} from '../../features/guest';
import { Guest, CreateGuestRequest, UpdateGuestRequest } from '../../features/guest/types';
import GuestForm from '../../components/guest/GuestForm';
import GuestDetail from '../../components/guest/GuestDetail';
import MainLayout from '../../layouts/MainLayout';

const GuestManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { guests, loading, error, selectedGuest } = useSelector((state: RootState) => state.guest);

  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchGuests());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [error, dispatch]);

  const handleCreateGuest = async (data: CreateGuestRequest) => {
    try {
      await dispatch(createGuest(data)).unwrap();
      setOpenForm(false);
    } catch (error) {
      console.error('Failed to create guest:', error);
    }
  };

  const handleUpdateGuest = async (data: UpdateGuestRequest) => {
    if (!editingGuest) return;
    
    try {
      await dispatch(updateGuest({ id: editingGuest.id, data })).unwrap();
      setOpenForm(false);
      setEditingGuest(null);
    } catch (error) {
      console.error('Failed to update guest:', error);
    }
  };

  const handleDeleteGuest = async (id: number) => {
    if (window.confirm(t('guest.delete.confirm'))) {
      try {
        await dispatch(deleteGuest(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete guest:', error);
      }
    }
  };

  const handleViewGuest = (guest: Guest) => {
    dispatch(setSelectedGuest(guest));
    setOpenDetail(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setOpenForm(true);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchGuests(searchQuery));
    } else {
      dispatch(fetchGuests());
    }
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    if (type) {
      dispatch(getGuestsByType(type));
    } else {
      dispatch(fetchGuests());
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status) {
      dispatch(getGuestsByStatus(status));
    } else {
      dispatch(fetchGuests());
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guest': return 'primary';
      case 'partner': return 'success';
      case 'vendor': return 'warning';
      case 'client': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {t('guest.management.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          {t('guest.add.new')}
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Box flex="1" minWidth="200px">
              <TextField
                fullWidth
                label={t('guest.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
            <Box flex="1" minWidth="200px">
              <FormControl fullWidth>
                <InputLabel>{t('guest.filter.type')}</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => handleTypeFilter(e.target.value)}
                  label={t('guest.filter.type')}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value="guest">{t('guest.type.guest')}</MenuItem>
                  <MenuItem value="partner">{t('guest.type.partner')}</MenuItem>
                  <MenuItem value="vendor">{t('guest.type.vendor')}</MenuItem>
                  <MenuItem value="client">{t('guest.type.client')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box flex="1" minWidth="200px">
              <FormControl fullWidth>
                <InputLabel>{t('guest.filter.status')}</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  label={t('guest.filter.status')}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  <MenuItem value="active">{t('guest.status.active')}</MenuItem>
                  <MenuItem value="inactive">{t('guest.status.inactive')}</MenuItem>
                  <MenuItem value="blocked">{t('guest.status.blocked')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('');
                  setStatusFilter('');
                  dispatch(fetchGuests());
                }}
              >
                {t('common.clear.filters')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Guests Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('guest.table.name')}</TableCell>
              <TableCell>{t('guest.table.company')}</TableCell>
              <TableCell>{t('guest.table.type')}</TableCell>
              <TableCell>{t('guest.table.status')}</TableCell>
              <TableCell>{t('guest.table.contact')}</TableCell>
              <TableCell>{t('guest.table.last_visit')}</TableCell>
              <TableCell align="center">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guests.map((guest: Guest) => (
              <TableRow key={guest.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>
                      {guest.avatar ? (
                        <img src={guest.avatar} alt={guest.name} />
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{guest.name}</Typography>
                      {guest.position && (
                        <Typography variant="caption" color="textSecondary">
                          {guest.position}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {guest.company && (
                    <Box display="flex" alignItems="center">
                      <BusinessIcon sx={{ mr: 1, fontSize: 16 }} />
                      {guest.company}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={t(`guest.type.${guest.type}`)}
                    color={getTypeColor(guest.type) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={t(`guest.status.${guest.status}`)}
                    color={getStatusColor(guest.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    {guest.email && (
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="caption">{guest.email}</Typography>
                      </Box>
                    )}
                    {guest.phone && (
                      <Box display="flex" alignItems="center">
                        <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="caption">{guest.phone}</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {guest.last_visit_date ? (
                    <Typography variant="caption">
                      {new Date(guest.last_visit_date).toLocaleDateString()}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      {t('guest.no.visits')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title={t('common.view')}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewGuest(guest)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.edit')}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditGuest(guest)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteGuest(guest.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {guests.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {t('guest.no.guests')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t('guest.no.guests.description')}
          </Typography>
        </Box>
      )}

      {/* Guest Form Dialog */}
      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingGuest(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingGuest ? t('guest.edit.title') : t('guest.add.title')}
        </DialogTitle>
        <DialogContent>
          <GuestForm
            guest={editingGuest}
            onSubmit={(data: CreateGuestRequest | UpdateGuestRequest) => {
              if (editingGuest) {
                handleUpdateGuest(data as UpdateGuestRequest);
              } else {
                handleCreateGuest(data as CreateGuestRequest);
              }
            }}
            onCancel={() => {
              setOpenForm(false);
              setEditingGuest(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Guest Detail Dialog */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('guest.detail.title')}</DialogTitle>
        <DialogContent>
          {selectedGuest && <GuestDetail guest={selectedGuest} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

              {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setOpenForm(true)}
        >
          <AddIcon />
        </Fab>
      </Box>
    </MainLayout>
  );
};

export default GuestManagement; 