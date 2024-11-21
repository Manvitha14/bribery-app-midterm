import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import ChatApp from './ChatApp';
import { jsPDF } from 'jspdf';
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
  } from '@mui/material';
  
  import { Home as HomeIcon, Chat as ChatIcon, VideoCall as VideoCallIcon, RemoveCircle as WithdrawIcon, Visibility as ViewIcon } from '@mui/icons-material';
  
import { useNavigate } from 'react-router-dom';

const SeeAllCases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCase, setSelectedCase] = useState(null);
    const [withdrawReason, setWithdrawReason] = useState('');
    const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
    const [activeDialog, setActiveDialog] = useState(null);
    const [withdrawStatus, setWithdrawStatus] = useState(null);
    const [activeChatCase, setActiveChatCase] = useState(null); // Track the active case for chat
    const [connectionId, setConnectionId] = useState("user182");
    const [receiverId, setReceiverId] = useState("user007");
    const [caseToWithdraw, setCaseToWithdraw] = useState(null);  // Track the case selected for withdrawal
    const [isChatOpen, setIsChatOpen] = useState({});
    const [selectedChat, setSelectedChat] = useState(null);




  const navigate = useNavigate();
  const token = "eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyODUxMDM0MC1lMGExLTcwOTgtZDAyNi03NDY4ZmQzOWFiMmQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjAwMy0wMS0xNCIsImdlbmRlciI6ImZlbWFsZSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX1FQdUpmT2FGYyIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiIyODUxMDM0MC1lMGExLTcwOTgtZDAyNi03NDY4ZmQzOWFiMmQiLCJvcmlnaW5fanRpIjoiYmVjOTQyMjctZTUyMi00MTJmLWJhN2YtNmM2N2Y3ZTkzNWYyIiwiYXVkIjoiMm1udjE3dm9hN2U4cTZiYW5sZzBqMHF0aCIsImV2ZW50X2lkIjoiZTEzYzc5MzctZGZlMy00MjEzLTlkYzAtYmU1MWNmYTZhN2Q2IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MzIxODg2NjMsIm5hbWUiOiJNYW53aXRoYSIsInBob25lX251bWJlciI6Iis5MTYzMDQzNDI0OTQiLCJleHAiOjE3MzIyNzUwNjMsImN1c3RvbTpyb2xlIjoidXNlciIsImlhdCI6MTczMjE4ODY2MywianRpIjoiMjBiZWMzMjEtYTQxYS00OWE1LWI2ZDMtZDkxOTk1ZGQyZjAzIiwiZW1haWwiOiJtYW5udTE5ODIwMjRAZ21haWwuY29tIn0.D6pJ1rtc3kBOE64rFNi2myhn-NmcFHDyRYgTbfagjOt9lecJS7gpHtuEtWttm5qHwZtJGAg12Z_WY07nuX3WO5CFosUL3cOzBty6SXW9MbFq0Ly_-Mq994wIufXBDez6zqpYxNC2F96mKbW9wnhOLo7CzTfbPxDv4L8_F1A0c_rd5H8YjENlUPgcsrqbVl5itPSkbpkjnIRrhYucwVc7hZsgr4rtAPRCWASkZvt3EfcM_Wv-asrVoym2bI4SaRBPZxKm1Fl7JzL4FKP5B2Fx_9R4LjVE2kwgvT9_-Jo17h2snc-m1RksYx6FelXRVD3N7Y0BwpSHotaVWdT_iutCrg";
  const targetCategoryId = 23;
  const targetUserId = 'user182';

  const decryptToken = (encryptedToken) => {
    try {
      const decoded = jwtDecode(encryptedToken);
      return decoded;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  };

  useEffect(() => {
    if (withdrawStatus === 'sent') {
      console.log('Final updated cases state:', cases);
    }
  }, [withdrawStatus, cases]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        // Set loading to true at the beginning of the fetch
        setLoading(true);

        const response = await axios.post(
          'https://p34mpb3lnc.execute-api.eu-west-2.amazonaws.com/User',
          { userid: targetUserId }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const parsedBody = JSON.parse(response.data.body);
        const allCases = Array.isArray(parsedBody.items) ? parsedBody.items : [];

        const filteredCases = allCases.filter(
          (caseItem) =>
            caseItem.categoryid === targetCategoryId && caseItem.userid === targetUserId
        );

        const caseList = filteredCases.map((caseItem) => ({
          caseId: caseItem.complaintid || 'N/A',
          casestatus: caseItem.casestatus || 'Unknown',
          policeId: caseItem.policeid || 'N/A',
          isFirFiled: caseItem.isfirfiled ? 'Yes' : 'No',
          incidentDetails: caseItem.individualdetails
            ? JSON.parse(caseItem.individualdetails)
            : {},
          isWithdrawn: caseItem.iswithdrawn || 0,
        }));
        setCases(caseList);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('Failed to fetch cases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [token, targetUserId, targetCategoryId]);

  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setActiveDialog('details'); 
  };

  const handleWithdrawCase = (caseItem) => {
    setSelectedCase(caseItem);
    setCaseToWithdraw(caseItem);
    setActiveDialog('withdraw');
  };

  const handleDialogClose = () => {
    setSelectedCase(null);
    setActiveDialog(null);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

//   const handleChatOpen = (caseId) => {
//     console.log("Opening chat for case", caseId);
//     setIsChatOpen((prevState) => ({ ...prevState, [caseId]: true }));
//   };
  
//   // Close chat for a specific case
//   const handleChatClose = (caseId) => {
//     console.log("Closing chat for case", caseId); 
//     setIsChatOpen((prevState) => ({ ...prevState, [caseId]: false }));
//   };

const handleChatOpen = (caseItem) => {
    setSelectedChat({
      connectionId: caseItem.userId, // User ID from the case
      receiverId: caseItem.policeId, // Police ID from the case
    });
  };
  
  const handleChatClose = () => {
    setSelectedChat(null);
  };
  const handleWithdrawSubmit = async () => {
    if (!withdrawReason || !isDeclarationChecked) {
      console.error('Please provide a reason and accept the declaration.');
      return;
    }

    try {
        const parseDetails = selectedCase.individualdetails || {};
        const decryptedToken = decryptToken(token); 

      const config = {
        headers: {
          Authorization:  `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      };

      const updatedCase = {
        ...selectedCase,
        iswithdrawn: 1,
        reasonforwithdrawal: withdrawReason,
        individualdetails: JSON.stringify(parseDetails),
      };

      console.log('Submitting withdrawal for case:', updatedCase);

      console.log('Payload to be sent:', updatedCase);

      // Make the PUT request to update the case
      await axios.put(
        'https://su68cvrr5h.execute-api.eu-west-2.amazonaws.com/User',
        updatedCase,
        { ...selectedCase, iswithdrawn: 1, reasonforwithdrawal: withdrawReason },
        config
      );

      console.log('Case withdrawal updated successfully');

     
      setCases((prevCases) =>
        prevCases.map((caseItem) =>
          caseItem.caseId === selectedCase.caseId
            ? { ...caseItem, isWithdrawn: 1 }
            : caseItem
        )
      );
   
  console.log('Updated case:', {
    caseId: selectedCase.caseId,
    iswithdrawn: 1,
    reasonforwithdrawal: withdrawReason,
  });

  setWithdrawStatus('sent'); // Update withdraw status
  handleDialogClose();
} catch (error) {
  console.error('Error submitting withdrawal:', error);
}
};

  const handleWithdrawClick = (cases) =>{
    setCaseToWithdraw(cases);
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (cases.length === 0)
    return (
      <Typography>
        No cases found for user ID {targetUserId} and category ID {targetCategoryId}.
      </Typography>
    );


    const handleDownloadPdf = (caseItem) => {
        const doc = new jsPDF();
      
        // Header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Digital Police System', 105, 20, { align: 'center' });
      
        // Case Details Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('FIR Case Details:', 14, 40);
        doc.setFontSize(12);
        
        let yOffset = 50;  // Define the starting point for vertical positioning
      
        doc.text(`Case ID: ${caseItem.caseId}`, 14, yOffset);
        yOffset += 10;
        doc.text(`Case Status: ${caseItem.casestatus}`, 14, yOffset);
        yOffset += 10;
        doc.text(`Police ID: ${caseItem.policeId}`, 14, yOffset);
        yOffset += 10;
        doc.text(`FIR Filed: ${caseItem.isFirFiled}`, 14, yOffset);
        yOffset += 10;
        doc.text(`Withdrawn: ${caseItem.isWithdrawn === 1 ? 'Yes' : 'No'}`, 14, yOffset);
        yOffset += 10;
      
        // Incident Details Section
        if (caseItem.individualdetails) {
          const incidentDetails = JSON.parse(caseItem.individualdetails);
          doc.text('Incident Details:', 14, yOffset);
          yOffset += 10;
          Object.entries(incidentDetails).forEach(([key, value]) => {
            doc.text(`${key}: ${value}`, 14, yOffset);
            yOffset += 10;
          });
        }
      
        // Footer with Police Officer's Signature
        doc.setFontSize(10);
        doc.text('-----------------------------', 14, yOffset + 20);
        doc.text('Signature of Police Officer', 14, yOffset + 30);
        doc.text('Date: ' + new Date().toLocaleDateString(), 14, yOffset + 40);
      
        // Adding page number in footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
      
        // Save the generated PDF
        doc.save(`${caseItem.caseId}_details.pdf`);
      };
      

  return (
    <Container
    maxWidth="lg"
    sx={{
      marginTop: '3rem',
      backgroundColor: '#e8f0fa', // Light police blue
      borderRadius: '8px',
      position: 'relative',
      padding: '2rem',
    }}
  >
    <Button
      variant="outlined"
      size="small"
      startIcon={<HomeIcon />}
      sx={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        borderRadius: '30px',
        padding: '8px 16px',
        borderColor: '#003566', // Deep blue border
        color: '#003566', // Deep blue text
        '&:hover': {
          backgroundColor: '#e63946', // Red hover effect
          color: '#fff',
        },
      }}
      onClick={handleBackToHome}
    >
      Back to Home
    </Button>
  
    <Typography
      variant="h4"
      sx={{
        textAlign: 'center',
        margin: '1rem 0',
        color: '#001d3d', // Dark police blue
        fontWeight: 'bold',
      }}
    >
      Cases
    </Typography>
  
    <Grid container spacing={3}>
      {cases.map((caseItem) => (
        <Grid item xs={12} sm={6} md={4} key={caseItem.caseId}>
          <Card
            sx={{
              backgroundColor: '#ffffff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              overflow: 'hidden',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 'auto', // Allow the card height to adjust
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#003566',
                  marginBottom: '8px',
                }}
              >
                Case ID: {caseItem.caseId}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5a5a5a', marginBottom: '8px' }}>
                Police ID: {caseItem.policeId}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                Case Status:{' '}
                <Chip
                  label={caseItem.casestatus}
                  color={caseItem.casestatus.toLowerCase() === 'closed' ? 'success' : 'primary'}
                  size="small"
                />
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                FIR Filed: {caseItem.isFirFiled}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                Withdrawn: {caseItem.isWithdrawn === 1 ? 'Yes' : 'No'}
              </Typography>
            </CardContent>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '16px',
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<ViewIcon />}
                sx={{
                  backgroundColor: '#003566',
                  '&:hover': {
                    backgroundColor: '#004080',
                  },
                }}
                onClick={() => handleViewDetails(caseItem)}
              >
                View Details
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<WithdrawIcon />}
                disabled={caseItem.isWithdrawn === 1}
                sx={{
                  borderColor: '#e63946',
                  color: '#e63946',
                  '&:hover': {
                    backgroundColor: '#e63946',
                    color: '#fff',
                  },
                }}
                onClick={() => handleWithdrawCase(caseItem)}
              >
                Withdraw
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ChatIcon />}
                sx={{
                  borderColor: '#457b9d',
                  color: '#457b9d',
                  '&:hover': {
                    backgroundColor: '#457b9d',
                    color: '#fff',
                  },
                }}
                onClick={() => handleChatOpen(caseItem.caseId)}
              >
                Chat
              </Button>

              {/* Chat Box - Dynamic Size
              {isChatOpen[caseItem.caseId] && (
                <Box
                  sx={{
                    marginTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '300px', // Set fixed height for chat box
                    maxHeight: '400px', // Allow the chat box to expand but not overflow
                    backgroundColor: '#f1f5fa', // Light background
                    borderRadius: '8px',
                    padding: '8px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    overflowY: 'auto', // Allow scrolling if the content exceeds the height
                  }}
                >
                  <ChatApp
                    connectionId={connectionId}
                    receiverId={receiverId}
                    onBack={() => handleChatClose(caseItem.caseId)}
                  />
                </Box>
              )} */}

                {/* Chat Sidebar */}
    {Object.keys(isChatOpen).map((caseId) =>
      isChatOpen[caseId] ? (
        <Box
          key={caseId}
          sx={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: '300px',
            height: '100vh',
            backgroundColor: '#ffffff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <ChatApp
            connectionId={connectionId}
            receiverId={receiverId}
            onBack={() => handleChatClose(caseId)}
          />
        </Box>
      ) : null
    )}

  {selectedChat && (
  <Box
    sx={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: '300px',
      height: '100vh',
      backgroundColor: '#ffffff',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <ChatApp
      connectionId={selectedChat.connectionId}
      receiverId={selectedChat.receiverId}
      onBack={handleChatClose}
    />
  </Box>
)}
              

              <Button
                variant="outlined"
                size="small"
                startIcon={<VideoCallIcon />}
                sx={{
                  borderColor: '#d62828',
                  color: '#d62828',
                  '&:hover': {
                    backgroundColor: '#d62828',
                    color: '#fff',
                  },
                }}
                onClick={() => alert('Start Video Call')}
              >
                Video Call
              </Button>

              {/* Download PDF button (if FIR Filed is Yes) */}
              {caseItem.isFirFiled === 'Yes' && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#457b9d',
                    color: '#457b9d',
                    '&:hover': {
                      backgroundColor: '#457b9d',
                      color: '#fff',
                    },
                  }}
                  onClick={() => handleDownloadPdf(caseItem)}
                >
                  Download as PDF
                </Button>
              )}
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
    {/* Dialog styles remain unchanged */}
    <Dialog
  open={activeDialog === 'details'}
  onClose={handleDialogClose}
  PaperProps={{
    sx: {
      backgroundColor: '#f1f5fa', // Light blue background
      borderRadius: '8px',
      border: '2px solid #003566', // Dark blue border
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Strong shadow
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: '#003566', // Dark blue header
      color: '#ffffff', // White text
      fontWeight: 'bold',
      textAlign: 'center',
    }}
  >
    Case Details
  </DialogTitle>
  <DialogContent sx={{ padding: '1.5rem' }}>
    {selectedCase && (
      <Box sx={{ padding: '1rem', lineHeight: '1.6' }}>
        <Typography
          variant="h6"
          sx={{
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#001d3d', // Deep blue text
          }}
        >
          Case ID: {selectedCase.caseId}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          <strong>Police ID:</strong> {selectedCase.policeId}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          <strong>Case Status:</strong> {selectedCase.casestatus}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          <strong>FIR Filed:</strong> {selectedCase.isFirFiled}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          <strong>Withdrawn:</strong> {selectedCase.isWithdrawn === 1 ? 'Yes' : 'No'}
        </Typography>
        {selectedCase.reasonforwithdrawal && (
          <Typography variant="body1" sx={{ color: '#d62828' }}>
            <strong>Reason for Withdrawal:</strong> {selectedCase.reasonforwithdrawal}
          </Typography>
        )}
        <Typography
          variant="h6"
          sx={{
            marginTop: '1rem',
            fontWeight: 'bold',
            color: '#003566', // Dark blue
          }}
        >
          Incident Details:
        </Typography>
        <Box
          sx={{
            backgroundColor: '#e8f0fa', // Light blue
            padding: '10px',
            borderRadius: '4px',
            marginTop: '0.5rem',
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap', // Preserve line breaks and spacing
            wordWrap: 'break-word', // Prevent overflow
            color: '#001d3d', // Text color
          }}
        >
          {Object.entries(selectedCase.incidentDetails).map(([key, value]) => (
            <Typography key={key} variant="body2">
              <strong>{key}:</strong> {value}
            </Typography>
          ))}
        </Box>
      </Box>
    )}
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'space-between', padding: '1rem' }}>
    <Button
      variant="outlined"
      sx={{
        borderColor: '#457b9d', // Blue border
        color: '#457b9d',
        '&:hover': {
          backgroundColor: '#457b9d',
          color: '#fff',
        },
      }}
      onClick={handleDialogClose}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

<Dialog
  open={activeDialog === 'withdraw'}
  onClose={handleDialogClose}
  PaperProps={{
    sx: {
      backgroundColor: '#f1f5fa', // Light blue background
      borderRadius: '8px',
      border: '2px solid #e63946', // Red border
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Strong shadow
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: '#e63946', // Red header
      color: '#ffffff', // White text
      fontWeight: 'bold',
      textAlign: 'center',
    }}
  >
    Withdraw Case
  </DialogTitle>
  <DialogContent sx={{ padding: '1.5rem' }}>
    {selectedCase && (
      <>
        <Typography variant="body1" sx={{ color: '#001d3d', marginBottom: '1rem' }}>
          Case ID: {selectedCase.caseId}
        </Typography>
        <TextField
          label="Reason for Withdrawal"
          value={withdrawReason}
          onChange={(e) => setWithdrawReason(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{
            marginBottom: '1rem',
            backgroundColor: '#ffffff', // White background for input
            borderRadius: '4px',
          }}
        />
        <Box sx={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={isDeclarationChecked}
              onChange={(e) => setIsDeclarationChecked(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            I declare that the above reason is valid and truthful.
          </label>
        </Box>
      </>
    )}
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'space-between', padding: '1rem' }}>
    <Button
      variant="outlined"
      sx={{
        borderColor: '#457b9d', // Blue border
        color: '#457b9d',
        '&:hover': {
          backgroundColor: '#457b9d',
          color: '#fff',
        },
      }}
      onClick={handleDialogClose}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      sx={{
        backgroundColor: withdrawReason && isDeclarationChecked ? '#003566' : '#b0bec5',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#e63946',
        },
      }}
      onClick={handleWithdrawSubmit}
      disabled={!withdrawReason || !isDeclarationChecked}
    >
      Submit
    </Button>
  </DialogActions>
</Dialog>
  </Container> 
  );
};
export default SeeAllCases;
