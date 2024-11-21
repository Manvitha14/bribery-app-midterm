import React, { useState } from 'react';
import axios from 'axios';
import Case from './Case';
import VictimDetails from './VictimDetails';
import EvidenceUpload from './EvidenceUpload';
import Review from './Review';
import BackToHomeButton from './BachToHomeButton';

function ComplaintForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    complaintCategory: '',
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    victimName: '',
    victimAge: '',
    victimGender: '',
    suspectName: '',
    location: '',
    dateOfIncident: '',
    evidenceDescription: '',
    evidenceFiles: [],
  });

  const [isChecked, setIsChecked] = useState(false); // Checkbox state
  const [errors, setErrors] = useState({}); // Validation errors

  // Validation function for each step
  const validateStep = () => {
    switch (step) {
      case 1:
        return validateCase(); // Case step validation
      case 2:
        return validateVictimDetails(); // Victim Details validation
      case 3:
        return validateEvidenceUpload(); // Evidence Upload validation
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
  const validateEvidenceUpload = () => {
    if (formData.evidenceFiles.length === 0) {
      setErrors((prev) => ({ ...prev, evidenceFiles: 'At least one evidence file is required.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, evidenceFiles: '' }));
    return true;
  };

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

  const handleSubmit = async () => {
    console.log('Submitting final form data...');
    console.log('Form Data:', formData);

    try {
      const individualDetails = JSON.stringify({
        complaint_category: formData.complaintCategory,
        victim_name: formData.victimName,
        victim_age: formData.victimAge,
        victim_gender: formData.victimGender,
        suspect_name: formData.suspectName,
        suspect_profession: formData.suspectProfession,
        location: formData.location,
        date_of_incident: formData.dateOfIncident,
        evidence_description: formData.evidenceDescription,
      });

      const payload = {
        categoryid: 23,
        userid: "user182",
        policeid: "user007",
        reasonforwithdrawal: null,
        iswithdrawalaccepted: 0,
        iswithdrawn: 0,
        iscomplaintaccepted: 0,
        isfake: 0,
        casestatus: 'Complaint Registered',
        isfirfiled: 0,
        individualdetails: individualDetails,
      };

      console.log('Payload:', payload);

      const token = "eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyODUxMDM0MC1lMGExLTcwOTgtZDAyNi03NDY4ZmQzOWFiMmQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjAwMy0wMS0xNCIsImdlbmRlciI6ImZlbWFsZSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX1FQdUpmT2FGYyIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiIyODUxMDM0MC1lMGExLTcwOTgtZDAyNi03NDY4ZmQzOWFiMmQiLCJvcmlnaW5fanRpIjoiYmVjOTQyMjctZTUyMi00MTJmLWJhN2YtNmM2N2Y3ZTkzNWYyIiwiYXVkIjoiMm1udjE3dm9hN2U4cTZiYW5sZzBqMHF0aCIsImV2ZW50X2lkIjoiZTEzYzc5MzctZGZlMy00MjEzLTlkYzAtYmU1MWNmYTZhN2Q2IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MzIxODg2NjMsIm5hbWUiOiJNYW53aXRoYSIsInBob25lX251bWJlciI6Iis5MTYzMDQzNDI0OTQiLCJleHAiOjE3MzIyNzUwNjMsImN1c3RvbTpyb2xlIjoidXNlciIsImlhdCI6MTczMjE4ODY2MywianRpIjoiMjBiZWMzMjEtYTQxYS00OWE1LWI2ZDMtZDkxOTk1ZGQyZjAzIiwiZW1haWwiOiJtYW5udTE5ODIwMjRAZ21haWwuY29tIn0.D6pJ1rtc3kBOE64rFNi2myhn-NmcFHDyRYgTbfagjOt9lecJS7gpHtuEtWttm5qHwZtJGAg12Z_WY07nuX3WO5CFosUL3cOzBty6SXW9MbFq0Ly_-Mq994wIufXBDez6zqpYxNC2F96mKbW9wnhOLo7CzTfbPxDv4L8_F1A0c_rd5H8YjENlUPgcsrqbVl5itPSkbpkjnIRrhYucwVc7hZsgr4rtAPRCWASkZvt3EfcM_Wv-asrVoym2bI4SaRBPZxKm1Fl7JzL4FKP5B2Fx_9R4LjVE2kwgvT9_-Jo17h2snc-m1RksYx6FelXRVD3N7Y0BwpSHotaVWdT_iutCrg";
      const response = await axios.post(
        'https://x4xn6amqo2.execute-api.eu-west-2.amazonaws.com/UserComplaints',
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
            const uploadResponse = await axios.post(
              'https://kz6gmd08a6.execute-api.ap-northeast-2.amazonaws.com/dev/uploadvideo',
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

      alert('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('An error occurred during submission.');
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
              disabled={!isChecked}
              style={{
                padding: '10px 20px',
                backgroundColor: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '20px',
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
