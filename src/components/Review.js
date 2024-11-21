import React, { useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, Grid, Typography, Box, Paper } from '@mui/material';

function Review({ formData, handleSubmit, prevStep }) {
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  // Log form data for review (on mount)
  useEffect(() => {
    console.log('Reviewing the following form data for submission:');
    console.log(formData);
  }, [formData]);

  return (
    <Box
      sx={{
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: 3,
        width: '70%',
        maxWidth: '900px',
        margin: '0 auto',
        marginTop: '3rem',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: '600',
          color: '#333',
          textAlign: 'center',
          marginBottom: '2rem',
          letterSpacing: '1px',
        }}
      >
        Step 4: Review and Submit
      </Typography>

      {/* Display entered data for review */}
      <Paper sx={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>
          Victim Information:
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', color: '#4c4c4c' }}>
          <strong>Name:</strong> {formData.victimName}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', color: '#4c4c4c' }}>
          <strong>Age:</strong> {formData.victimAge}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', color: '#4c4c4c' }}>
          <strong>Gender:</strong> {formData.victimGender}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', color: '#4c4c4c' }}>
          <strong>Suspect Name:</strong> {formData.suspectName}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', color: '#4c4c4c' }}>
          <strong>Date of Incident:</strong> {formData.dateOfIncident}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', color: '#4c4c4c' }}>
          <strong>Evidence Description:</strong> {formData.evidenceDescription}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', color: '#4c4c4c' }}>
          <strong>Evidence Files:</strong> {formData.evidenceFiles.length} file(s) selected.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Review;
