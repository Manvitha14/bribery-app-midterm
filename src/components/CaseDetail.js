// // src/components/CaseDetails.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Box, Typography, Container, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const CaseDetails = () => {
//   const { caseId } = useParams(); // Get the caseId from the URL
//   const [caseDetails, setCaseDetails] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Find the case from the previously passed data (you could fetch it again from the server here)
//     const storedCases = JSON.parse(localStorage.getItem('cases') || '[]');
//     const caseDetail = storedCases.find((item) => item.caseId === caseId);
//     setCaseDetails(caseDetail);
//   }, [caseId]);

//   const handleBackToAllCases = () => {
//     navigate('/all-cases');
//   };

//   if (!caseDetails) {
//     return <Typography>Loading details...</Typography>;
//   }

//   return (
//     <Container
//       maxWidth="lg"
//       sx={{
//         marginTop: '3rem',
//         paddingLeft: { xs: '16px', sm: '32px' },
//         paddingRight: { xs: '16px', sm: '32px' },
//         backgroundColor: '#f4f6f9',
//         borderRadius: '8px',
//       }}
//     >
//       <Button
//         variant="outlined"
//         color="primary"
//         size="small"
//         sx={{
//           marginBottom: '1rem',
//           borderRadius: '30px',
//           padding: '8px 16px',
//         }}
//         onClick={handleBackToAllCases}
//       >
//         Back to All Cases
//       </Button>

//       <Typography
//         variant="h4"
//         sx={{
//           marginBottom: '2rem',
//           fontWeight: '600',
//           color: '#333',
//           textAlign: 'center',
//           letterSpacing: '1px',
//         }}
//       >
//         Case Details (Case ID: {caseDetails.caseId})
//       </Typography>
      
//       <Box sx={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px' }}>
//         <Typography variant="h6">Incident Details:</Typography>
//         <pre>{JSON.stringify(caseDetails.incidentDetails, null, 2)}</pre>
//       </Box>
//     </Container>
//   );
// };

// export default CaseDetails;
