import baseTemplate from "./baseTemplate.js";

export const accountUnblockedTemplate = () => 
    baseTemplate({
    title: "Account Restored",
    content: `
      <p>Your account has been unblocked.</p>
      <p>You can now access all features again.</p>
    `
  });
