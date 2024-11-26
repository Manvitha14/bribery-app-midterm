import jsPDF from "jspdf";

// Function to fetch image and convert it to base64 (browser-compatible)
const fetchImageAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Get the base64 part
      resolve(`data:image/png;base64,${base64String}`);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateFIRCopy = async (rawCaseItem) => {
  // Parse the raw case item to handle both JSON strings and objects
  const caseItem =
    typeof rawCaseItem === "string" ? JSON.parse(rawCaseItem) : rawCaseItem;

  // Parse nested data if necessary
  const individualDetails =
    typeof caseItem.individualdetails === "string"
      ? JSON.parse(caseItem.individualdetails)
      : caseItem.individualdetails;

  // Create a new PDF document
  const doc = new jsPDF();

  // Set up a border around the page
  doc.setLineWidth(1);
  doc.rect(5, 5, 200, 287); // Border around the document

  // Set up the background color and header
  doc.setFillColor(0, 51, 102); // DiGiPo Portal Color
  doc.rect(0, 0, 210, 40, "F"); // Header Rectangle

  // Add DiGiPo Portal Header
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255); // White Text
  doc.text("DiGiPo Complaint Copy", 105, 25, { align: "center" });

  // Insert DiGiPo Logo
  const imageUrl = "https://i.ibb.co/qR43n8z/logodigipoloader.png";
  const base64Image = await fetchImageAsBase64(imageUrl);
  doc.addImage(base64Image, "PNG", 10, 5, 30, 30); // Optionally add logo

  // Title and Case Information
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Bribery Case Report", 105, 50, { align: "center" });

  // Case ID and other metadata
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black text for normal case info
  doc.text(`Case ID: ${caseItem.complaintid}`, 20, 65);
  doc.text(`Date of Report: ${new Date().toLocaleDateString()}`, 20, 70);
  doc.text(`Category: Bribery`, 20, 75);

  // Narrative Section
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black Text for Narrative
  doc.text("Case Details:", 20, 90);
  doc.setFontSize(13);
  const narrative = `On ${new Date().toLocaleDateString()}, a bribery complaint was filed under Case ID ${caseItem.complaintid}. The victim, identified as ${
    individualDetails.victim_name || "N/A"
  }, was last seen at ${individualDetails.location || "an undisclosed location"}. The incident was reported, and the victim was allegedly bribed by ${
    individualDetails.suspect_name || "unknown individuals"
  } at approximately ${individualDetails.date_of_incident || "N/A"}. Currently, the case status is ${
    caseItem.casestatus || "Pending"
  }.`;

  // Add narrative text to the document with wrapping
  doc.text(narrative, 20, 96, { maxWidth: 180 });

  // Incident Details Section
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102); // Section Title Color
  doc.text("Incident Details:", 20, 140);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0); // Normal Text Color
  doc.text(`Victim Name: ${individualDetails.victim_name || "N/A"}`, 20, 145);
  doc.text(`Last Seen: ${individualDetails.date_of_incident || "N/A"}`, 20, 150);
  doc.text(`Location: ${individualDetails.location || "N/A"}`, 20, 155);
  doc.text(
    `Suspect Details: ${individualDetails.suspect_name || "N/A"}`,
    20,
    160
  );

  // Investigation Details
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text("Investigation Details:", 20, 175);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Investigator ID: ${caseItem.policeid || "N/A"}`, 20, 180);
  doc.text(`Investigation Status: ${caseItem.casestatus || "Pending"}`, 20, 185);

  // Case Status Section
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text("Case Status:", 20, 200);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`FIR Filed: ${caseItem.isfirfiled ? "Yes" : "No"}`, 20, 205);
  doc.text(`Case Status: ${caseItem.casestatus || "Pending"}`, 20, 210);

  // Important note about the case
  doc.setFontSize(12);
  doc.setTextColor(255, 0, 0); // Red Text for special notes
  doc.text(
    "Important Note: This is an ongoing investigation. Efforts are in progress to resolve the case.",
    20,
    230,
    { maxWidth: 180 }
  );

  // Seal - Add a circular seal at the bottom left with "FIR FILED" spelled in it
  doc.setFillColor(255, 0, 0); // Red color for the seal
  doc.circle(23, 265, 15, "F"); // Draw filled circle for the seal
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255); // White text for the seal
  doc.text("FIR FILED", 23, 265, { align: "center" });

  // Digital Signature placeholder at the bottom right
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black text for signature
  doc.text("Digital Signature:", 150, 270);
  doc.setFont("Courier", "normal");
  doc.setFontSize(10);
  doc.text("This is an auto-generated document.", 115, 275);
  doc.text("It is valid without a physical signature.", 115, 280);

  // Footer Section
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "This document was generated by DiGiPo Portal. All rights reserved.",
    105,
    290,
    { align: "center" }
  );

  // Save the document as a PDF
  doc.save(`FIR_Case_${caseItem.complaintid}.pdf`);
};
