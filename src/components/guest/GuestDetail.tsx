import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Note as NoteIcon,
  ContactPhone as ContactPhoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Guest } from '../../features/guest/types';

interface GuestDetailProps {
  guest: Guest;
}

const GuestDetail: React.FC<GuestDetailProps> = ({ guest }) => {
  const { t } = useTranslation();

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

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={3} mb={3}>
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={guest.avatar}
        />
        <Box flex={1}>
          <Typography variant="h4" gutterBottom>
            {guest.name}
          </Typography>
          <Box display="flex" gap={1} mb={2}>
            <Chip
              label={t(`guest.type.${guest.type}`)}
              color={getTypeColor(guest.type) as any}
            />
            <Chip
              label={t(`guest.status.${guest.status}`)}
              color={getStatusColor(guest.status) as any}
            />
          </Box>
          {guest.position && (
            <Typography variant="body1" color="textSecondary">
              {guest.position}
            </Typography>
          )}
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Basic Information and Company Information */}
        <Box display="flex" gap={3} flexWrap="wrap">
          {/* Basic Information */}
          <Box flex="1" minWidth="300px">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('guest.basic.information')}
                </Typography>
                <List dense>
                  {guest.email && (
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('guest.form.email')}
                        secondary={guest.email}
                      />
                    </ListItem>
                  )}
                  {guest.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('guest.form.phone')}
                        secondary={guest.phone}
                      />
                    </ListItem>
                  )}
                  {guest.address && (
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('guest.form.address')}
                        secondary={guest.address}
                      />
                    </ListItem>
                  )}
                  {guest.first_visit_date && (
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('guest.first.visit')}
                        secondary={new Date(guest.first_visit_date).toLocaleDateString()}
                      />
                    </ListItem>
                  )}
                  {guest.last_visit_date && (
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('guest.last.visit')}
                        secondary={new Date(guest.last_visit_date).toLocaleDateString()}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Company Information */}
          <Box flex="1" minWidth="300px">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('guest.company.information')}
                </Typography>
                <List dense>
                  {guest.company && (
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('guest.form.company')}
                        secondary={guest.company}
                      />
                    </ListItem>
                  )}
                  {guest.position && (
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('guest.form.position')}
                        secondary={guest.position}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t('guest.form.type')}
                      secondary={t(`guest.type.${guest.type}`)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t('guest.form.status')}
                      secondary={t(`guest.status.${guest.status}`)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Contacts */}
        {guest.contacts && guest.contacts.length > 0 && (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('guest.contacts')}
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {guest.contacts.map((contact) => (
                    <Box key={contact.id} flex="1" minWidth="300px">
                      <Paper sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <ContactPhoneIcon />
                          <Typography variant="subtitle2">
                            {contact.contact_name}
                          </Typography>
                          {contact.is_primary && (
                            <Chip label={t('guest.primary.contact')} size="small" color="primary" />
                          )}
                        </Box>
                        {contact.contact_position && (
                          <Typography variant="body2" color="textSecondary" mb={1}>
                            {contact.contact_position}
                          </Typography>
                        )}
                        {contact.contact_email && (
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <EmailIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">
                              {contact.contact_email}
                            </Typography>
                          </Box>
                        )}
                        {contact.contact_phone && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">
                              {contact.contact_phone}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Recent Visits */}
        {guest.visits && guest.visits.length > 0 && (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('guest.recent.visits')}
                </Typography>
                <List dense>
                  {guest.visits.slice(0, 5).map((visit) => (
                    <ListItem key={visit.id}>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={visit.purpose}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {new Date(visit.check_in).toLocaleString()}
                            </Typography>
                            {visit.host && (
                              <Typography variant="caption" color="textSecondary">
                                {t('guest.host')}: {visit.host.name}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Chip
                        label={t(`guest.visit.status.${visit.status}`)}
                        size="small"
                        color={visit.status === 'checked_out' ? 'success' : 'warning'}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Notes */}
        {guest.notes && (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('guest.notes')}
                </Typography>
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <NoteIcon sx={{ mt: 0.5 }} />
                  <Typography variant="body2">
                    {guest.notes}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GuestDetail; 