import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import MainLayout from '../../layouts/MainLayout';

// Lấy user hiện tại từ localStorage
function getCurrentUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const user = getCurrentUser();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <MainLayout>
        <Box p={4}><Alert severity="error">User not found. Please login again.</Alert></Box>
      </MainLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Giả lập update, thực tế sẽ gọi API
      localStorage.setItem('user', JSON.stringify({ ...user, ...form }));
      setSuccess(t('profile.update_success') || 'Cập nhật thành công!');
    } catch (err) {
      setError(t('profile.update_error') || 'Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box maxWidth={600} mx="auto" mt={4}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" mb={2}>{t('profile.title') || 'My Profile'}</Typography>
          <Divider sx={{ mb: 3 }} />
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar src={form.avatar} sx={{ width: 80, height: 80, mr: 3 }} />
            <Box>
              <Typography variant="h6">{form.name}</Typography>
              <Typography color="text.secondary">{form.email}</Typography>
            </Box>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box flex="1 1 300px">
                <TextField
                  label={t('profile.form.name') || 'Name'}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Box>
              <Box flex="1 1 300px">
                <TextField
                  label={t('profile.form.email') || 'Email'}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="email"
                />
              </Box>
              <Box flex="1 1 300px">
                <TextField
                  label={t('profile.form.phone') || 'Phone'}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box flex="1 1 300px">
                <TextField
                  label={t('profile.form.avatar') || 'Avatar URL'}
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box flex="1 1 300px">
                <TextField
                  label={t('profile.form.department') || 'Department'}
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box flex="1 1 300px">
                <TextField
                  label={t('profile.form.position') || 'Position'}
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            </Box>
            <Box mt={3}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {t('profile.update') || 'Update'}
              </Button>
            </Box>
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;