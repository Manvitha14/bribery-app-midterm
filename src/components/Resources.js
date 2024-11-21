import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Resources = () => {
  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f7f7f7",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        animation: "fadeIn 1.5s ease-in-out",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Roboto', sans-serif",
          color: "#3f51b5",
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
          animation: "slideDown 1.5s ease",
        }}
      >
        Resources
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#333",
          textAlign: "center",
          fontSize: "1.1rem",
          marginBottom: "30px",
          lineHeight: 1.6,
        }}
      >
        Welcome to the Resources page. Below, you'll find comprehensive information and guides to help you make the most of the Digital Police System:
      </Typography>

      <List sx={{ listStyle: "none", padding: 0 }}>
        {/* How to File a Complaint */}
        <ListItem
          sx={{
            backgroundColor: "white",
            margin: "15px 0",
            borderRadius: "5px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <ListItemText
            primary="How to File a Complaint"
            secondary={
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                Filing a complaint in the Digital Police System involves the following steps:
                <ol>
                  <li>Visit the "Register a Complaint" page and fill in the required details, including your name, contact information, and the incident description.</li>
                  <li>Provide any available evidence, such as photos, videos, or documents.</li>
                  <li>Submit the complaint. A confirmation number will be generated for tracking purposes.</li>
                  <li>You can check the status of your complaint anytime in the "My Cases" section.</li>
                </ol>
                Ensure all details are accurate and truthful to avoid delays in processing.
              </div>
            }
          />
        </ListItem>

        {/* Emergency Contact Numbers */}
        <ListItem
          sx={{
            backgroundColor: "white",
            margin: "15px 0",
            borderRadius: "5px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <ListItemText
            primary="Emergency Contact Numbers"
            secondary={
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                In case of emergencies, you can contact:
                <ul>
                  <li>Police Helpline: <strong>112</strong></li>
                  <li>Fire Department: <strong>101</strong></li>
                  <li>Ambulance Services: <strong>108</strong></li>
                  <li>Women's Helpline: <strong>181</strong></li>
                  <li>Local Police Station: Locate your nearest station using our interactive map.</li>
                </ul>
                Keep these numbers saved for quick access during emergencies.
              </div>
            }
          />
        </ListItem>

        {/* Your Legal Rights */}
        <ListItem
          sx={{
            backgroundColor: "white",
            margin: "15px 0",
            borderRadius: "5px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <ListItemText
            primary="Your Legal Rights"
            secondary={
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                As a citizen, you have the following rights when interacting with law enforcement:
                <ul>
                  <li><strong>Right to Information:</strong> You have the right to know the reason for your arrest or detention.</li>
                  <li><strong>Right to File a Complaint:</strong> Every individual has the right to file a complaint without fear of discrimination or retaliation.</li>
                  <li><strong>Right to Legal Representation:</strong> You are entitled to consult with a lawyer before and during interrogation.</li>
                  <li><strong>Protection for Whistleblowers:</strong> Laws protect those who report corruption or criminal activities.</li>
                </ul>
                Learn more about these rights in the Citizen's Handbook on our platform.
              </div>
            }
          />
        </ListItem>

        {/* Officer's Manual */}
        <ListItem
          sx={{
            backgroundColor: "white",
            margin: "15px 0",
            borderRadius: "5px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <ListItemText
            primary="Officer's Manual"
            secondary={
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                The Officer's Manual provides detailed procedures for handling cases:
                <ul>
                  <li><strong>Case Registration:</strong> Guidelines for verifying and registering complaints submitted by citizens.</li>
                  <li><strong>Evidence Management:</strong> Procedures for collecting, storing, and analyzing evidence while maintaining a clear chain of custody.</li>
                  <li><strong>Victim Assistance:</strong> Steps to ensure the safety and support of victims during investigations.</li>
                  <li><strong>Investigation Protocols:</strong> Best practices for conducting fair and unbiased investigations.</li>
                </ul>
                Access the full manual in the Officer's Portal.
              </div>
            }
          />
        </ListItem>

        {/* Crime Statistics */}
        <ListItem
          sx={{
            backgroundColor: "white",
            margin: "15px 0",
            borderRadius: "5px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <ListItemText
            primary="Crime Statistics"
            secondary={
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                Stay informed with the latest crime statistics and reports:
                <ul>
                  <li>View crime trends in your area, including theft, assault, and fraud statistics.</li>
                  <li>Analyze year-over-year changes in crime rates at the state and national levels.</li>
                  <li>Access detailed reports on solved and pending cases.</li>
                  <li>Use filters to explore specific categories, such as cybercrime, drug-related offenses, or property crimes.</li>
                </ul>
                These statistics are updated regularly to help you stay aware of safety issues in your community.
              </div>
            }
          />
        </ListItem>
      </List>
      {/* Nearby Police Stations */}
      <ListItem
          sx={{
            backgroundColor: "white",
            margin: "15px 0",
            borderRadius: "5px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <ListItemText
            primary="Nearby Police Stations"
            secondary={
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                Below are some police stations in your area:
                <ul>
                  <li><strong>Central Police Station:</strong> 123 Main St, Springfield, Tel: <strong>(123) 456-7890</strong></li>
                  <li><strong>Northside Police Station:</strong> 456 Elm St, Springfield, Tel: <strong>(123) 555-1212</strong></li>
                  <li><strong>West End Police Station:</strong> 789 Maple Ave, Springfield, Tel: <strong>(123) 987-6543</strong></li>
                  <li><strong>Downtown Precinct:</strong> 321 Oak St, Springfield, Tel: <strong>(123) 111-2222</strong></li>
                  <li><strong>Eastview Police Station:</strong> 654 Pine Rd, Springfield, Tel: <strong>(123) 333-4444</strong></li>
                </ul>
                You can also use the "Locate Station" feature on our platform to find stations nearest to you.
              </div>
            }
          />
        </ListItem>

      {/* Back to Home Button */}
      <Box sx={{ textAlign: "center", marginTop: "30px" }}>
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{
            backgroundColor: "#3f51b5",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#303f9f",
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default Resources;
