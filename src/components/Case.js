import React, { useState } from 'react';
import { TextField, MenuItem, Box, Typography } from '@mui/material';

function Case({ formData, setFormData }) {
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'complaintCategory':
        if (!value) error = 'Complaint category is required.';
        break;
      case 'fullName':
        if (!value.trim()) error = 'Full name is required.';
        break;
      case 'phoneNumber':
        if (!/^\d{10}$/.test(value)) error = 'Phone number must be 10 digits.';
        break;
      case 'adharNumber':
        if (!/^\d{12}$/.test(value)) error = 'Aadhar number must be 12 digits.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address.';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });
    validateField(field, value); // Validate on change
  };

  const handleBlur = (field) => (e) => {
    const value = e.target.value;
    validateField(field, value); // Validate on blur
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: '2rem', fontWeight: '600', color: '#333' }}>
        Step 1: Complaint Details
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Complaint Category */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Complaint Category <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.complaintCategory}
            onChange={handleChange('complaintCategory')}
            onBlur={handleBlur('complaintCategory')}
            error={!!errors.complaintCategory}
            helperText={errors.complaintCategory}
            select
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              '& .MuiInputBase-root': {
                padding: '12px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d1d1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6A4CFF',
              },
            }}
          >
            <MenuItem value="Bribery">Bribery</MenuItem>
            <MenuItem value="Corruption">Corruption</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </div>

        {/* Full Name */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Full Name <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.fullName}
            onChange={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              '& .MuiInputBase-root': {
                padding: '12px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d1d1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6A4CFF',
              },
            }}
          />
        </div>

        {/* Phone Number */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Phone Number <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            onBlur={handleBlur('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              '& .MuiInputBase-root': {
                padding: '12px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d1d1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6A4CFF',
              },
            }}
          />
        </div>

        {/* Aadhar Number */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Aadhar Number <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.adharNumber}
            onChange={handleChange('adharNumber')}
            onBlur={handleBlur('adharNumber')}
            error={!!errors.adharNumber}
            helperText={errors.adharNumber}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              '& .MuiInputBase-root': {
                padding: '12px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d1d1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6A4CFF',
              },
            }}
          />
        </div>

        {/* Email Address */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Email Address <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={!!errors.email}
            helperText={errors.email}
            type="email"
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              '& .MuiInputBase-root': {
                padding: '12px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d1d1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6A4CFF',
              },
            }}
          />
        </div>

        {/* Complaint Description */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>Complaint Description</Typography>
          <TextField
            fullWidth
            value={formData.complaintDescription}
            onChange={(e) => setFormData({ ...formData, complaintDescription: e.target.value })}
            multiline
            rows={4}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              '& .MuiInputBase-root': {
                padding: '12px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d1d1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6A4CFF',
              },
            }}
          />
        </div>
      </Box>
    </div>
  );
}

export default Case;
