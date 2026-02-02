import baseTemplate from "./baseTemplate";

export const accountBlockedTemplate = (reason) =>
    baseTemplate({
    title: "Account Blocked",
    content: `
      <p>Your account has been blocked by our admin team.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you believe this is a mistake, please contact support.</p>
    `
  });