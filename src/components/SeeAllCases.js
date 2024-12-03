import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import ChatApp from './ChatApp';
import { generateFIRCopy } from "./pdfUtils";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { jsPDF } from 'jspdf';
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
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
    Stepper,
    Step,
    StepLabel,
    Tooltip,
    LinearProgress,
    Pagination
  } from '@mui/material';
  import SearchIcon from '@mui/icons-material/Search';
  import IconButton from '@mui/material/IconButton';
  import InputBase from '@mui/material/InputBase';
  import Paper from '@mui/material/Paper';
  
  import { Home as HomeIcon, Chat as ChatIcon, VideoCall as VideoCallIcon, RemoveCircle as WithdrawIcon, Visibility as ViewIcon } from '@mui/icons-material';
  import { decryptToken } from '../authUtils';
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
    const [connectionId, setConnectionId] = useState();
    const [receiverId, setReceiverId] = useState();
    const [caseToWithdraw, setCaseToWithdraw] = useState(null);  // Track the case selected for withdrawal
    const [isChatOpen, setIsChatOpen] = useState({});
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [filteredCases, setFilteredCases] = useState(cases); // Initially show all cases
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const casesPerPage = 4; // Number of cases per page
    

    
    // const getCaseStatusIndex = (status) => {
    //   const statusList = [
    //     "Complaint Registered",
    //     "Verification in Progress",
    //     "under investigation",
    //     "Action Taken",
    //     "Case Closed",
    //   ];
    //   return statusList.indexOf(status);
    // };

    const getCaseStatusIndex = (status) => {
      const statusList = [
        "Complaint Registered",
        "Verification in Progress",
        "Under Investigation",
        "Action Taken",
        "Case Closed",
      ];
    
      const index = statusList.findIndex(
        (item) => item.toLowerCase() === status?.toLowerCase()
      );
    
      if (index === -1) {
        console.warn(`Unknown status: ${status}`);
      }
    
      return index === -1 ? 0 : index; // Default to the first step if status is unknown
    };
    
    //   // Calculate total pages
      const totalPages = Math.ceil(cases.length / casesPerPage);
    
      // Slice cases for the current page
      const displayedCases = cases.slice((currentPage - 1) * casesPerPage, currentPage * casesPerPage);
    
      // Handle page change
      const handlePageChange = (event, value) => {
        setCurrentPage(value);
      };
    
     
      // const handleSearch = () => {
      //   if (!searchTerm.trim()) {
      //     setFilteredCases(cases); // Show all cases if search is empty
      //     return;
      //   }
      
      //   const results = cases.filter(
      //     (caseItem) =>
      //       caseItem.complaintid &&
      //       caseItem.complaintid.toString().toLowerCase().includes(searchTerm.trim().toLowerCase())
      //   );
      
      //   console.log("Search Term:", searchTerm);
      //   console.log("Filtered Results:", results);
      
      //   setFilteredCases(results);
      // };
      
      
      // const handleSearchChange = (event) => {
      //   setSearchTerm(event.target.value); // Update search term
      // };
  const navigate = useNavigate();

  const username = sessionStorage.getItem("userName");
  const targetCategoryId = 23;
  const targetUserId = username;

 
  useEffect(() => {
    if (withdrawStatus === 'sent') {
      console.log('Final updated cases state:', cases);
    }
  }, [withdrawStatus, cases]);
  
  const jwtToken = sessionStorage.getItem('jwt');  
  const token = decryptToken(jwtToken);
  useEffect(() => {
    const fetchCases = async () => {
      try {

        setLoading(true); // Set loading to true at the beginning
  
        const response = await axios.post(
          process.env.REACT_APP_USER_API_URL,
          { userid: targetUserId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log("Raw response:", response.data);
  
        const parsedBody =
          typeof response.data.body === "string"
            ? JSON.parse(response.data.body)
            : response.data.body;
  
        console.log("Parsed body:", parsedBody);
  
        const allCases = Array.isArray(parsedBody.items) ? parsedBody.items : [];
        console.log("All cases:", allCases);
  
        const filteredCases = allCases.filter(
          (caseItem) =>
            caseItem.categoryid === targetCategoryId && caseItem.userid === targetUserId
        );
  
        console.log("Filtered cases:", filteredCases);
        setCases(filteredCases);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('Failed to fetch cases. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCases();
  }, [token, targetUserId, targetCategoryId]);
  
  const handleScheduleMeeting = (caseId) => {
    navigate(`/meetings/${caseId}`);
};
  const handleViewDetails = (caseItem) => {
    const parsedDetails =
      typeof caseItem.individualdetails === 'string'
        ? JSON.parse(caseItem.individualdetails)
        : caseItem.individualdetails;
  
    setSelectedCase({ ...caseItem, individualdetails: parsedDetails });
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
    navigate('/home');
  };
const handleChatOpen = (complaintid) => {
    const selectedCase = cases.find((caseItem) => caseItem.complaintid === complaintid);
    if (selectedCase) {
      setSelectedChat({
        connectionId: selectedCase.userid,
        receiverId: selectedCase.policeid,
      });
    }
  };
  
  const handleChatClose = () => {
    setSelectedChat(null);
  };
  const handleWithdrawSubmit = async () => {
    if (!withdrawReason || !isDeclarationChecked) {
      console.error("Please provide a reason and accept the declaration.");
      return;
    }
  
    try {
      const jwtToken = sessionStorage.getItem('jwt');  
      const token = decryptToken(jwtToken);
      const parseDetails = selectedCase.individualdetails || {};
      const decryptedToken = decryptToken(token);
      console.log("Decrypted Token:", decryptedToken);
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
  
      const updatedCase = {
        ...selectedCase,
        iswithdrawn: 1, // Backend expects this field
        reasonforwithdrawal: withdrawReason,
        individualdetails: parseDetails, // Send as an object unless string is required
      };
  
      console.log("Payload being sent:");
  
      // Make the PUT request to update the case
      await axios.put(
        process.env.REACT_APP_USER_API_URL,
        updatedCase,
        config
      );
  
      console.log("Case withdrawal updated successfully",updatedCase);
  
      // Update the local state immediately
      setCases((prevCases) =>
        prevCases.map((caseItem) =>
          caseItem.complaintid === selectedCase.complaintid
            ? { ...caseItem, iswithdrawn: 1 } // Update to match the local state
            : caseItem
        )
      );
  
      setWithdrawStatus("sent"); // Update withdraw status
      handleDialogClose();
    } catch (error) {
      if (error.response) {
        console.error(
          "Server Error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("Network Error or No Response:", error.message);
      } else {
        console.error("Error:", error.message);
      }
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
       No cases found.
      </Typography>
    );


   
  return (
    <Container
    maxWidth="lg"
    sx={{
      marginTop: '3rem',
      backgroundColor: '#e8f0fa', // Light blue background
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
  {/* Search Bar */}
 
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
    {/* Search Bar
<Box mb={4}>
  <Paper
    component="form"
    onSubmit={(e) => {
      e.preventDefault();
      handleSearch();
    }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 1,
      borderRadius: 2,
      boxShadow: 1,
    }}
  >
    <InputBase
      placeholder="Search cases by ID, police ID, or status..."
      value={searchTerm}
      onChange={handleSearchChange} // Attach the defined function here
      sx={{ flex: 1, px: 1 }}
    />
    <IconButton type="submit" color="primary">
      <SearchIcon />
    </IconButton>
  </Paper>
</Box> */}

  
    <Grid container spacing={3}>
      {displayedCases.map((caseItem) => (
        <Grid item xs={12} key={caseItem.complaintid}>
          <Card
            sx={{
              backgroundColor: '#ffffff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              overflow: 'hidden',
              padding: '16px',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 'auto', // Allow content to adjust dynamically
            }}
          >
            <CardContent>
            <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    gap: '12px',
    flexWrap: 'nowrap', // Prevent wrapping
    overflow: 'hidden', // Ensure content doesn't overflow
  }}
>
  {[
    'Complaint Registered',
    'Verification in Progress',
    'Under Investigation',
    'Action Taken',
    'Case Closed',
  ].map((status, index) => {
    const isCompleted = index <= getCaseStatusIndex(caseItem.casestatus);
    return (
      <Box
        key={status}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: '1', // Ensures even distribution
          minWidth: '0', // Avoids resizing issues
        }}
      >
        {/* Tooltip for Status Circle */}
        <Tooltip title={status} arrow>
          <Box
            sx={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isCompleted ? '#28a745' : '#ccc',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              flexShrink: '0', // Prevent shrinking
            }}
          >
            {isCompleted && '✔'} {/* Tick mark */}
          </Box>
        </Tooltip>

        {/* Connector Line */}
        {index < 4 && (
          <Box
            sx={{
              flexGrow: '1', // Dynamic width
              height: '4px',
              backgroundColor: isCompleted ? '#28a745' : '#ccc',
              marginX: '8px',
            }}
          ></Box>
        )}
      </Box>
    );
  })}
</Box>

  
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#003566',
                  marginBottom: '8px',
                }}
              >
                Case ID: {caseItem.complaintid}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#5a5a5a', marginBottom: '8px' }}
              >
                Police ID: {caseItem.policeid}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                Case Status:{' '}
                <Chip
                  label={caseItem.casestatus}
                  color={
                    caseItem.casestatus.toLowerCase() === 'closed'
                      ? 'success'
                      : 'primary'
                  }
                  size="small"
                />
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                FIR Filed: {caseItem.isfirfiled}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                Withdrawn: {caseItem.iswithdrawn === 1 ? 'Yes' : 'No'}
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
  disabled={caseItem.iswithdrawn === 1} // Use `isWithdrawn` from updated state
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
                onClick={() => handleChatOpen(caseItem.complaintid)}
              >
                Chat
              </Button>

              <Button
  variant="outlined"
  size="small"
  startIcon={<VideoCameraFrontIcon />} // Use an appropriate icon, e.g., from Material-UI
  sx={{
    borderColor: '#e63946',
    color: '#e63946',
    '&:hover': {
      backgroundColor: '#e63946',
      color: '#fff',
    },
  }}
  onClick={()=>{
    handleScheduleMeeting(caseItem.complaintid)
  }}
>
  Video
</Button>

                {/* Chat Sidebar */}
    {Object.keys(isChatOpen).map((complaintid) =>
      isChatOpen[complaintid] ? (
        <Box
          key={complaintid}
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
            onBack={() => handleChatClose(complaintid)}
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
    console.log(selected.receiverId);
  </Box>
)}
             {caseItem.isfirfiled === 1 && (
  <Button
    variant="outlined"
    size="small"
    sx={{
      borderColor: "#457b9d",
      color: "#457b9d",
      "&:hover": {
        backgroundColor: "#457b9d",
        color: "#fff",
      },
    }}
    onClick={() => generateFIRCopy(selectedCase)} // Updated to call the imported function
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
          Case ID: {selectedCase.complaintid}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          <strong>Police ID:</strong> {selectedCase.policeid}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          <strong>Case Status:</strong> {selectedCase.casestatus}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          <strong>FIR Filed:</strong> {selectedCase.isfirfiled}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          <strong>Withdrawn:</strong> {selectedCase.iswithdrawn === 1 ? 'Yes' : 'No'}
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
           {Object.entries(selectedCase.individualdetails).map(([key, value]) => (
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
          Case ID: {selectedCase.complaintid}
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
  {/* Pagination Component */}
  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#003566',
            },
          }}
        />
      </Box>
  </Container> 
  );
};

export default SeeAllCases;
