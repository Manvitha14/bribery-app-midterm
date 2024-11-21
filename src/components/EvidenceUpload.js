import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Button } from '@mui/material';

function EvidenceUpload({ formData, setFormData }) {
  const [evidenceDescription, setEvidenceDescription] = useState(formData.evidenceDescription || '');
  const [evidenceFiles, setEvidenceFiles] = useState(formData.evidenceFiles || []);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = [...evidenceFiles, ...files];
    setEvidenceFiles(updatedFiles);
    setFormData((prevState) => ({
      ...prevState,
      evidenceFiles: updatedFiles, // Update formData with selected files
    }));
  };

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      evidenceDescription, // Keep evidenceDescription updated in formData
    }));
  }, [evidenceDescription, setFormData]);

  return (
    <div>
      <Typography variant="h5" gutterBottom sx={{ marginBottom: '1rem', fontWeight: 600, color: '#333' }}>
        Step 3: Upload Evidence
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* File input for evidence */}
        <Button
          variant="outlined"
          component="label"
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: 600,
            color: '#6A4CFF',
            borderColor: '#6A4CFF',
            '&:hover': {
              backgroundColor: '#6A4CFF',
              color: '#fff',
            },
          }}
        >
          Select Evidence Files
          <input
            type="file"
            accept=".jpg,.png,.mp4,.mov"
            onChange={handleFileChange}
            multiple
            hidden
          />
        </Button>

        {evidenceFiles.length > 0 && (
          <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
            {evidenceFiles.length} file(s) selected.
          </Typography>
        )}

        {/* Evidence description */}
        <TextField
          label="Evidence Description"
          fullWidth
          multiline
          rows={4}
          value={evidenceDescription}
          onChange={(e) => setEvidenceDescription(e.target.value)}
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
            '& .MuiOutlinedInput-root': {
              '&:focus': {
                borderColor: '#6A4CFF',
              },
            },
          }}
        />
      </Box>
    </div>
  );
}

export default EvidenceUpload;
