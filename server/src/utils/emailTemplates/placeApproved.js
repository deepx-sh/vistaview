import baseTemplate from "./baseTemplate";

export const placeApprovedTemplate = (placeName) =>
      baseTemplate({
    title: "Your Place Has Been Approved ",
    content: `
      <p>Your place <strong>${placeName}</strong> is now live on VistaView.</p>
      <p>Users can view and review your listing.</p>
    `
  });