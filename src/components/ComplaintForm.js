import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Case from './Case';
import VictimDetails from './VictimDetails';
import EvidenceUpload from './EvidenceUpload';
import Review from './Review';
import BackToHomeButton from './BachToHomeButton';
import { decryptToken } from '../authUtils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
 

const encryptedToken = sessionStorage.getItem('jwt');
const token = encryptedToken ? decryptToken(encryptedToken) : {};

function ComplaintForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData,userDetails] = useState({
    complaintCategory: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    victimName: '',
    victimAge: '',
    victimGender: '',
    suspectName: '',
    location: '',
    dateOfIncident: '',
    ComplaintDescription:'',
    evidenceDescription: '',
    evidenceFiles: [],
  });

   // Set phoneNumber and email once token is available
   useEffect(() => {
    if (token) {
      setFormData((prevData) => ({
        ...prevData,
        phoneNumber: token.phoneNumber || '',
        email: token.email || '',
      }));
    }
  }, [token]); 

  const [isChecked, setIsChecked] = useState(false); // Checkbox state
  const [errors, setErrors] = useState({}); // Validation errors
  const navigate= useNavigate();
  // Validation function for each step
  const validateStep = () => {
    switch (step) {
      case 1:
        return validateCase(); // Case step validation
      case 2:
        return validateVictimDetails(); // Victim Details validation
      // case 3:
      //   return validateEvidenceUpload(); // Evidence Upload validation
      case 4:
        return validateReview(); // Review validation
      default:
        return true;
    }
  };

  // Case validation (Step 1)
  const validateCase = () => {
    if (!formData.complaintCategory) {
      setErrors({ ...errors, complaintCategory: 'Complaint category is required.' });
      return false;
    }
    setErrors((prev) => ({ ...prev, complaintCategory: '' }));
    return true;
  };

  const caseAppliedTime = new Date().toISOString();

  // Victim Details validation (Step 2)
  const validateVictimDetails = () => {
    let isValid = true;
    let tempErrors = {};
    if (!formData.victimName.trim()) {
      tempErrors.victimName = "Victim's name is required.";
      isValid = false;
    }
    if (!formData.victimAge || formData.victimAge <= 0) {
      tempErrors.victimAge = "Victim's age must be a positive number.";
      isValid = false;
    }
    if (!formData.victimGender) {
      tempErrors.victimGender = "Victim's gender is required.";
      isValid = false;
    }
    if (!formData.suspectName.trim()) {
      tempErrors.suspectName = "Suspect's name is required.";
      isValid = false;
    }
    if (!formData.location.trim()) {
      tempErrors.location = 'Location of incident is required.';
      isValid = false;
    }
    if (!formData.dateOfIncident) {
      tempErrors.dateOfIncident = 'Date of incident is required.';
      isValid = false;
  }
    setErrors((prev) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  // Evidence Upload validation (Step 3)
  // const validateEvidenceUpload = () => {
  //   if (formData.evidenceFiles.length === 0) {
  //     setErrors((prev) => ({ ...prev, evidenceFiles: 'At least one evidence file is required.' }));
  //     return false;
  //   }
  //   setErrors((prev) => ({ ...prev, evidenceFiles: '' }));
  //   return true;
  // };

  // Review validation (Step 4)
  const validateReview = () => {
    if (!isChecked) {
      setErrors((prev) => ({ ...prev, isChecked: 'You must confirm the information is correct.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, isChecked: '' }));
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };


const assignPoliceOfficer = async () => {
  try {
      // Step 1: Fetch all users
      const encryptedtoken=sessionStorage.getItem('jwt');
      const token=decryptToken(encryptedtoken);
      const response = await axios.get(
          process.env.REACT_APP_POLICE_DATA,
          {
              headers: { Authorization: `Bearer ${token}` },
          }
      );

      const allUsers = JSON.parse(response.data.body);

      // Step 2: Filter users with the role "Police"
      const policeOfficers = allUsers.filter(user => user.role === 'investigator');

      if (policeOfficers.length === 0) {
          console.error('No police officers available.');
          return null;
      }

      // Step 3: Sort the police officers
      const sortedPoliceOfficers = policeOfficers.sort((a, b) => {
          // Specialization relevance (exact match with caseSpecialization comes first)
          const specializationMatchA = a.specialization === 'Bribery' ? 1 : 0;
          const specializationMatchB = b.specialization === 'Bribery' ? 1 : 0;

          if (specializationMatchA !== specializationMatchB) {
              return specializationMatchB - specializationMatchA;
          }

          // Assigned cases (lower is better)
          if (a.assignedCases !== b.assignedCases) {
            return a.assignedCases - b.assignedCases;
        }

          // Experience (higher is better)
          if (parseInt(b.experience) !== parseInt(a.experience)) {
              return parseInt(b.experience) - parseInt(a.experience);
          }            

          // Finished cases (higher is better)
          return b.finishedCases - a.finishedCases;
      });

      // Step 4: Assign case to the top-ranked police officer
      const selectedPoliceOfficer = sortedPoliceOfficers[0];
      console.log('Assigned Police Officer:', selectedPoliceOfficer);

      return selectedPoliceOfficer;
  } catch (error) {
      console.error('Error fetching or assigning police officers:', error);
      return null;
  }
};


const updateAssignedCases = async (officer) => {
try {
    // Prepare the payload
    const updatedOfficerData = {
        personid: officer.personid, // Officer's unique ID
        updatedFields: {
            assignedCases: officer.assignedCases + 1, // Increment assigned cases
        },
    };

    const encryptedtoken=sessionStorage.getItem('jwt');
    const token=decryptToken(encryptedtoken);
    // Send PATCH request to your Lambda function
    const response = await axios.patch(
        process.env.REACT_APP_PATCH_POLICE_DATA_URL, // Replace with your Lambda function URL
        updatedOfficerData,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }
    );

    if (response.status === 200) {
        console.log("Assigned cases updated successfully:", response.data);
        return response.data;
    } else {
        console.error("Failed to update assigned cases:", response);
        return null;
    }
} catch (error) {
    console.error("Error updating assigned cases:", error);
    return null;
}
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};


  const handleSubmit = async () => {
    console.log('Submitting final form data...');
    console.log('Form Data:', formData);

    const username = sessionStorage.getItem("userName");

    const assignedOfficer = await assignPoliceOfficer();
        if (!assignedOfficer) {
            alert("No suitable police officer is available for assignment.");
            return;
        }

    try {
      const individualDetails = JSON.stringify({
        complaint_category: formData.complaintCategory,
        complainantName: formData.victimName,
        victim_age: formData.victimAge,
        victim_gender: formData.victimGender,
        suspect_name: formData.suspectName,
        phone_number:formData.phoneNumber,
        suspect_profession: formData.suspectProfession,
        location: formData.location,
        victim_email:formData.email,
        incident_description:formData.ComplaintDescription,
        incident_date: formData.dateOfIncident,
        caseappliedtime: caseAppliedTime,
        evidence_description: formData.evidenceDescription,
      });

      const payload = {
        categoryid: 23,
        userid: username,
        policeid: assignedOfficer.personid,
        reasonforwithdrawal: null,
        iswithdrawalaccepted: 0,
        iswithdrawn: 0,
        iscomplaintaccepted: 1,
        isfake: 0,
        casestatus: 'Complaint Registered',
        isfirfiled: 0,
        individualdetails: individualDetails,
      };

      console.log('Payload:', payload);
      const jwtToken = sessionStorage.getItem('jwt');  
      const token = decryptToken(jwtToken);
     // const token = "eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyODUxMDM0MC1lMGExLTcwOTgtZDAyNi03NDY4ZmQzOWFiMmQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjAwMy0wMS0xNCIsImdlbmRlciI6ImZlbWFsZSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX1FQdUpmT2FGYyIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiIyODUxMDM0MC1lMGExLTcwOTgtZDAyNi03NDY4ZmQzOWFiMmQiLCJvcmlnaW5fanRpIjoiMzdkN2U5OGQtNzFlOC00NDMyLWIwOWQtYTQ4MGU4NGZjNDgwIiwiYXVkIjoiMm1udjE3dm9hN2U4cTZiYW5sZzBqMHF0aCIsImV2ZW50X2lkIjoiYWYzN2ZlMDQtNjkxYS00MDBjLWE0ZTctZTUwMjliOGY2YzEzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MzI1MDYyMzksIm5hbWUiOiJNYW53aXRoYSIsInBob25lX251bWJlciI6Iis5MTYzMDQzNDI0OTQiLCJleHAiOjE3MzI1OTI2MzksImN1c3RvbTpyb2xlIjoidXNlciIsImlhdCI6MTczMjUwNjIzOSwianRpIjoiMDU0ZDdmYjYtMTZjZS00MjQ2LWI1NWUtNjUwNTczZDMxYjA5IiwiZW1haWwiOiJtYW5udTE5ODIwMjRAZ21haWwuY29tIn0.EZ9mO0nT0jKOrPD5zVxMXfXoOeAvWO8TgEyCMeRwCdabt2yZOF1OUPsWVUT8onMbZUzpCzua4EJ_YOUPeZvoZRtm62FZKhEpe69wmG4p3uOuOfHAdcnqJzfjqKtTkWZiRdBmAaGA_lOEINFDWmUoTrR-sR35SwgOcr8uenpoJ8kR5f6AisNj1_m3IIm_gmBB-reAEip6Y7RMGQUD0kub6vgrp1sJfd6KhP_BIOTYK9Q4kCzrBX69nBIx-nbVFzCVEk86UV0ueylVZkIAQTEbB96exae3Nu5wzmxD6m4GTBDSyLe9Nskl9afXUhLfkYrGPV2kdgozHf8ociDwtkeQWw";
      const response = await axios.post(
        process.env.REACT_APP_API_URL,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Complaint submission response:', response);

      const responseBody = JSON.parse(response.data.body);
      const complaintId = responseBody.data.complaintid;

      console.log('Complaint ID:', complaintId);

      if (formData.evidenceFiles.length > 0) {
        for (let file of formData.evidenceFiles) {
          console.log(`Uploading file: ${file.name}`);
          const folderName = `${complaintId}`;
          const evidencePayload = {
            folderName: folderName,
            fileName: file.name,
            fileType: file.type,
            isEvidence: true,
          };

          console.log('Evidence payload:', evidencePayload);

          try {
            const jwtToken = sessionStorage.getItem('jwt');  
            const token = decryptToken(jwtToken);
            const uploadResponse = await axios.post(
              process.env.REACT_APP_UPLOAD_VIDEO_URL,
              { body: evidencePayload },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log('Upload response:', uploadResponse);

            if (uploadResponse.status === 200) {
              const preSignedUrl = JSON.parse(uploadResponse.data.body).url;

              console.log(`Uploading to pre-signed URL: ${preSignedUrl}`);
              await axios.put(preSignedUrl, file, {
                headers: {
                  'Content-Type': file.type,
                },
              });

              console.log(`Evidence file ${file.name} uploaded successfully`);
            } else {
              console.error('Error generating pre-signed URL:', uploadResponse.data.error);
            }
          } catch (uploadError) {
            console.error('Error uploading evidence:', uploadError);
          }
        }
      } else {
        console.log('No evidence files to upload.');
      }
      const whatsappPayload = {
        "to": `+91${formData.phoneNumber}`,
        "message": ` Dear ${formData.victimName},
          
          We are writing to confirm that your report regarding Online Identity Theft has been successfully registered in our system. We appreciate you bringing this matter to our attention and assure you that your case will be handled with the utmost priority and confidentiality.
          
          Complaint Details:
          Complaint ID: ${complaintId}
          Complaint category: ${formData.complaintCategory}  
          Date of Registration: ${formData.dateOfIncident}
          
          Our team will review the details provided and initiate the necessary actions. Should we require any additional information or documents, you will be notified promptly via this email address or the contact number provided in your form.
          
          For your reference, here are some useful tips:
          
          - Avoid sharing sensitive personal or financial information online.
          - Change passwords immediately if you suspect a breach.
          - Report any suspicious activities linked to this case.
          
          If you have any questions or require further assistance, feel free to contact us at Email: support@digitalpolice.com
          ,Phone: +123 456 7890. Please include your Case ID for faster resolution.
          
          Thank you for reporting and helping us combat Bribery effectively.
          
          Warm regards,
          DiGiPo `
      }
      
      console.log("WhatsApp URL:", process.env.REACT_APP_WHATSAPP_URL);
      const apiResponse = await axios.post(
        process.env.REACT_APP_WHATSAPP_URL,
        whatsappPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
           },
        }
      );

      console.log(apiResponse);

      const emailPayload = {
        recipient_email: formData.email, 
        subject: "Case Registered Successfully",
        message_body: `
          Dear ${formData.victimName},
          
          We are writing to confirm that your report regarding Online Identity Theft has been successfully registered in our system. We appreciate you bringing this matter to our attention and assure you that your case will be handled with the utmost priority and confidentiality.
          
          Complaint Details:
          Complaint ID: ${complaintId}
          Complaint category: ${formData.complaintCategory}  
          Date of Registration: ${formData.dateOfIncident}
          
          Our team will review the details provided and initiate the necessary actions. Should we require any additional information or documents, you will be notified promptly via this email address or the contact number provided in your form.
          
          For your reference, here are some useful tips:
          
          - Avoid sharing sensitive personal or financial information online.
          - Change passwords immediately if you suspect a breach.
          - Report any suspicious activities linked to this case.
          
          If you have any questions or require further assistance, feel free to contact us at Email: support@digitalpolice.com
          ,Phone: +123 456 7890. Please include your Case ID for faster resolution.
          
          Thank you for reporting and helping us combat Bribery effectively.
          
          Warm regards,
          DiGiPo 
        `,
      };
      
 
      // Log the email payload
      console.log("Email payload:", emailPayload);
 
      // Make the POST request to send the email
      const emailApi = process.env.REACT_APP_EMAIL_API_URL;
 
      const snsResponse = await fetch(emailApi, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });
 
      // Log the SNS response for debugging
      console.log("SNS Response:", snsResponse);
 
      // Parse the SNS response body
      const snsResponseBody = await snsResponse.json();
      console.log("SNS Response Body:", snsResponseBody);
 
      if (!snsResponse.ok) {
        console.error(
          "Failed to send email:",
          snsResponse.status,
          snsResponseBody.message
        );
        throw new Error(
          `Email API error: ${snsResponseBody.message || "Unknown error"}`
        );
      } else {
        console.log("Email sent successfully:", snsResponseBody);
      }   
  
  toast.success('Complaint submitted successfully!, you will receive a mail regarding  complaint details to your submitted mailid', {
    position: 'top-right',
    autoClose: 3000, // Close after 3 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  setTimeout(() => {
    navigate("/home");
  }, 3000);
} catch (error) {
  console.error('Error submitting complaint:', error);
  toast.error('An error occurred during submission.', {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
};

  return (
    <div className="complaint-form-wrapper" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '30px' }}>
      <div
        className="form-container"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
         <ToastContainer position="top-right" autoClose={3000} />
        {/* Back to Home Button in Top-Right Corner */}
        <BackToHomeButton style={{ position: 'absolute', top: '20px', right: '20px' }} />

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Register Your Bribery Complaint</h2>

        {/* Stepper with New Color Scheme */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                backgroundColor: step === stepNum ? '#e74c3c' : '#95a5a6', // Updated color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                margin: '0 15px',
                transition: 'background-color 0.3s ease',
              }}
            >
              {stepNum}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        {step === 1 && <Case formData={formData} setFormData={setFormData} errors={errors} />}
        {step === 2 && <VictimDetails formData={formData} setFormData={setFormData} errors={errors} />}
        {step === 3 && <EvidenceUpload formData={formData} setFormData={setFormData} errors={errors} />}
        {step === 4 && <Review formData={formData} setFormData={setFormData} errors={errors} />}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {step > 1 && <button onClick={prevStep} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Back</button>}
          {step < 4 && <button onClick={nextStep} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Next</button>}
        </div>

        {/* Checkbox & Submit Button */}
        {step === 4 && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              I confirm all the information is correct.
            </label>
            <button
  onClick={handleSubmit}
  disabled={!isChecked} // Button is disabled if isChecked is false
  style={{
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '20px',
    opacity: isChecked ? 1 : 0.5, // Adjust opacity for a better visual cue
  }}
>
  Submit
</button>

          </div>
        )}
      </div>
    </div>
  );
}

export default ComplaintForm;
