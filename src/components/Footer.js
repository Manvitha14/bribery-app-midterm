// import React from "react";
// import "./footer.css";
// import { useOverlay } from "./OverlayContext";
// import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material"; // Importing MUI icons

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="footer-content">
//         <div className="footer-section contact">
//           <h4>Contact Us</h4>
//           <p>Email: support@digitalpolice.com</p>
//           <p>Phone: +123 456 7890</p>
//         </div>
//         <div className="footer-section social-media">
//           <h4>Follow Us</h4>
//           <div className="social-links">
//             <a
//               href="https://facebook.com/digitalpolice"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="social-icon"
//             >
//               <Facebook fontSize="large" />
//               <span>Facebook</span>
//             </a>
//             <a
//               href="https://twitter.com/digitalpolice"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="social-icon"
//             >
//               <Twitter fontSize="large" />
//               <span>Twitter</span>
//             </a>
//             <a
//               href="https://linkedin.com/company/digitalpolice"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="social-icon"
//             >
//               <LinkedIn fontSize="large" />
//               <span>LinkedIn</span>
//             </a>
//             <a
//               href="https://instagram.com/digitalpolice"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="social-icon"
//             >
//               <Instagram fontSize="large" />
//               <span>Instagram</span>
//             </a>
//           </div>
//         </div>
//         <div className="footer-section quick-links">
//           <h4>Quick Links</h4>
//           <ul>
//             <li>
//               <a href="#home">Home</a>
//             </li>
//             <li>
//               <a href="#about">About Us</a>
//             </li>
//             <li>
//               <a href="#services">Services</a>
//             </li>
//             <li>
//               <a href="#contact">Contact</a>
//             </li>
//           </ul>
//         </div>
//       </div>
//       <div className="footer-bottom">
//         <p>
//           🌟 Powered by Digital Police. &copy; {new Date().getFullYear()} All
//           Rights Reserved.
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import LocationOn from "@mui/icons-material/LocationOn";
import Phone from "@mui/icons-material/Phone";
import WebIcon from "@mui/icons-material/Web";
import Email from "@mui/icons-material/Email";
 
const Footer = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
 
  return (
    <Box
      sx={{
        backgroundColor: "#003366",
        color: "#F5F5F5",
        padding: { xs: 1, sm: 2 },
        fontFamily: "'Roboto', sans-serif",
        marginTop: "auto",
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: { xs: "center", md: "left" }, // Center content for small screens
        }}
      >
        {/* Company Info */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              marginBottom: 1,
              color: "#FFD700",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <img
              src="https://i.ibb.co/bRk596h/logodigipo-1.png"
              alt="DiGIPo Logo"
              style={{ verticalAlign: "middle", marginRight: 8, marginTop: 8 }}
            />
            DiGiPo
          </Typography>
          <Typography variant="body2" sx={{ color: "#B0C4DE" }}>
            Content is owned and maintained by DiGiPo IT Services.
          </Typography>
        </Grid>
 
        {/* Quick Links */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              marginBottom: 2,
              color: "#FFD700",
              textAlign: "center", // Center the header
            }}
          >
            Quick Links
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column", // Arrange items in a single column
              alignItems: "center", // Center the items horizontally
              gap: 1, // Add space between links
            }}
          >
            {[
              { name: "Login", path: "/login" },
              { name: "Sign-up", path: "/signup" },
              { name: "Forgot password", path: "/forgot-password" },
              { name: "Connect with us", path: "/contact-us" },
            ].map((link, index) => (
              <Link
                key={index}
                component={RouterLink}
                to={link.path}
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  padding: "3px 1px", // Add padding for better click area
                  borderRadius: "4px", // Add rounded corners
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {link.name}
              </Link>
            ))}
          </Box>
        </Grid>
 
        {/* Social Media */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                marginBottom: 1,
                color: "#FFD700",
              }}
            >
              Follow Us
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
                marginBottom: 2, // Space below the icons
              }}
            >
              {[
                { icon: <WebIcon />, url: "https://psiog.com/" },
                {
                  icon: <Instagram />,
                  url: "https://www.instagram.com/psiogdigital?igsh=MXJ0NGpuaG56MTRvMg==",
                },
                {
                  icon: <LinkedIn />,
                  url: "https://www.linkedin.com/company/psiog-digital/",
                },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  target="_blank"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFFFFF" }, // Optional hover effect
                  }}
                  aria-label="Social Media"
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
            <Typography variant="body2" sx={{ color: "#B0C4DE" }}>
              Designed and Developed by DiGiPo IT Services, Chennai
            </Typography>
          </Box>
        </Grid>
 
        {/* Contact Info */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#FFD700",
              marginBottom: 1,
            }}
          >
            Contact Us
          </Typography>
          <Typography variant="body2" sx={{ color: "#B0C4DE" }}>
            <LocationOn sx={{ verticalAlign: "middle", marginRight: "4px" }} />{" "}
            WorkEZ Space Solutions, Chennai 600041
          </Typography>
          <Typography variant="body2" sx={{ color: "#B0C4DE" }}>
            <Phone
              sx={{
                verticalAlign: "middle",
                marginRight: "4px",
                marginTop: "5px",
              }}
            />{" "}
            044 4203 7993
          </Typography>
          <Typography variant="body2" sx={{ color: "#B0C4DE" }}>
            <Email
              sx={{
                verticalAlign: "middle",
                marginRight: "4px",
                marginTop: "5px",
              }}
            />{" "}
            digitalpoliceportal@gmail.com
          </Typography>
          <Typography
            variant="body2"
            sx={{
              marginTop: 2,
              color: "#FFD700",
              fontWeight: 600,
            }}
          >
            Current Date & Time:{" "}
            <strong>{currentDateTime.toLocaleString()}</strong>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
 
export default Footer;
