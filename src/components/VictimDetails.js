import React, { useState } from 'react';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

function VictimDetails({ formData, setFormData }) {
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'victimName':
        if (!value.trim()) error = "Victim's name is required.";
        break;
      case 'victimAge':
        if (!value || value <= 0) error = "Victim's age must be a positive number.";
        break;
      case 'victimGender':
        if (!value) error = "Victim's gender is required.";
        break;
      case 'suspectName':
        if (!value.trim()) error = "Suspect's name is required.";
        break;
      case 'suspectProfession':
        if (!value.trim()) error = "Suspect's profession is required.";
        break;
      case 'location':
        if (!value.trim()) error = 'Location of incident is required.';
        break;
      case 'dateOfIncident':
        if (!value) error = 'Date of incident is required.';
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
        Step 2: Victim Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Victim's Name */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Victim's Name <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.victimName}
            onChange={handleChange('victimName')}
            onBlur={handleBlur('victimName')}
            error={!!errors.victimName}
            helperText={errors.victimName}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Victim's Age */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Victim's Age <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={formData.victimAge}
            onChange={handleChange('victimAge')}
            onBlur={handleBlur('victimAge')}
            error={!!errors.victimAge}
            helperText={errors.victimAge}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Victim's Gender */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Victim's Gender <span style={{ color: 'red' }}>*</span>
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.victimGender}
              onChange={handleChange('victimGender')}
              onBlur={handleBlur('victimGender')}
              error={!!errors.victimGender}
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Suspect's Name */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Suspect's Name <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.suspectName}
            onChange={handleChange('suspectName')}
            onBlur={handleBlur('suspectName')}
            error={!!errors.suspectName}
            helperText={errors.suspectName}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Suspect's Profession */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Suspect's Profession <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.suspectProfession}
            onChange={handleChange('suspectProfession')}
            onBlur={handleBlur('suspectProfession')}
            error={!!errors.suspectProfession}
            helperText={errors.suspectProfession}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Location of Incident */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Location of Incident <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.location}
            onChange={handleChange('location')}
            onBlur={handleBlur('location')}
            error={!!errors.location}
            helperText={errors.location}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Date of Incident */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Date of Incident <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={formData.dateOfIncident}
            onChange={handleChange('dateOfIncident')}
            onBlur={handleBlur('dateOfIncident')}
            error={!!errors.dateOfIncident}
            helperText={errors.dateOfIncident}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        {/* Time of Incident */}
        <div>
          <Typography sx={{ marginBottom: '0.5rem', fontWeight: 500 }}>
            Time of Incident
          </Typography>
          <TextField
            fullWidth
            type="time"
            value={formData.timeOfIncident}
            onChange={(e) =>
              setFormData({ ...formData, timeOfIncident: e.target.value })
            }
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </Box>
    </div>
  );
}

export default VictimDetails;
