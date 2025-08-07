import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Guest, CreateGuestRequest, UpdateGuestRequest } from '../../features/guest/types';

interface GuestFormProps {
  guest?: Guest | null;
  onSubmit: (data: CreateGuestRequest | UpdateGuestRequest) => void;
  onCancel: () => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ guest, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateGuestRequest>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    type: 'guest',
    status: 'active',
    notes: '',
    avatar: '',
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        email: guest.email || '',
        phone: guest.phone || '',
        company: guest.company || '',
        position: guest.position || '',
        address: guest.address || '',
        type: guest.type,
        status: guest.status,
        notes: guest.notes || '',
        avatar: guest.avatar || '',
      });
    }
  }, [guest]);

  const handleChange = (field: keyof CreateGuestRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove empty strings
    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === '' ? undefined : value
      ])
    );

    onSubmit(cleanedData as CreateGuestRequest | UpdateGuestRequest);
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.type;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Avatar Section */}
        <Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{ width: 80, height: 80 }}
              src={formData.avatar}
            />
            <Box>
              <Typography variant="h6" gutterBottom>
                {guest ? t('guest.edit.profile') : t('guest.add.profile')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('guest.avatar.description')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Basic Information */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('guest.basic.information')}
          </Typography>
        </Box>

        <Box display="flex" gap={3} flexWrap="wrap">
          <Box flex="1" minWidth="250px">
            <TextField
              fullWidth
              label={t('guest.form.name')}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </Box>

          <Box flex="1" minWidth="250px">
            <TextField
              fullWidth
              label={t('guest.form.email')}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Box>
        </Box>

        <Box display="flex" gap={3} flexWrap="wrap">
          <Box flex="1" minWidth="250px">
            <TextField
              fullWidth
              label={t('guest.form.phone')}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </Box>

          <Box flex="1" minWidth="250px">
            <TextField
              fullWidth
              label={t('guest.form.position')}
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </Box>
        </Box>

        <Box>
          <TextField
            fullWidth
            label={t('guest.form.address')}
            multiline
            rows={3}
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </Box>

        {/* Company Information */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('guest.company.information')}
          </Typography>
        </Box>

        <Box display="flex" gap={3} flexWrap="wrap">
          <Box flex="1" minWidth="250px">
            <TextField
              fullWidth
              label={t('guest.form.company')}
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
            />
          </Box>

          <Box flex="1" minWidth="250px">
            <FormControl fullWidth>
              <InputLabel>{t('guest.form.type')}</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                label={t('guest.form.type')}
                required
              >
                <MenuItem value="guest">{t('guest.type.guest')}</MenuItem>
                <MenuItem value="partner">{t('guest.type.partner')}</MenuItem>
                <MenuItem value="vendor">{t('guest.type.vendor')}</MenuItem>
                <MenuItem value="client">{t('guest.type.client')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box display="flex" gap={3} flexWrap="wrap">
          <Box flex="1" minWidth="250px">
            <FormControl fullWidth>
              <InputLabel>{t('guest.form.status')}</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                label={t('guest.form.status')}
              >
                <MenuItem value="active">{t('guest.status.active')}</MenuItem>
                <MenuItem value="inactive">{t('guest.status.inactive')}</MenuItem>
                <MenuItem value="blocked">{t('guest.status.blocked')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box flex="1" minWidth="250px">
            <TextField
              fullWidth
              label={t('guest.form.avatar_url')}
              value={formData.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </Box>
        </Box>

        {/* Additional Information */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('guest.additional.information')}
          </Typography>
        </Box>

        <Box>
          <TextField
            fullWidth
            label={t('guest.form.notes')}
            multiline
            rows={4}
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder={t('guest.form.notes.placeholder')}
          />
        </Box>

        {/* Form Actions */}
        <Box>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid()}
            >
              {guest ? t('common.update') : t('common.create')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GuestForm; 