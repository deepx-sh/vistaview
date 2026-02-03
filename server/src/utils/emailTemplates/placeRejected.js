import baseTemplate from "./baseTemplate.js";

export const placeRejectedTemplate = (placeName, reason) =>
    baseTemplate({
    title: "Your Place Has Been Rejected",
    content: `
      <p>Your place <strong>${placeName}</strong> was rejected.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>You may update and resubmit your place.</p>
    `
  });