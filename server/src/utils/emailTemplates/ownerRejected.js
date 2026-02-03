import baseTemplate from "./baseTemplate.js";

export const ownerRejectedTemplate = (name, reason) => 
    baseTemplate({
         title: "Owner Verification Rejected",
    content: `
      <p>Hi ${name},</p>
      <p>Your owner verification request was rejected.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>You may reapply after correcting the issue.</p>
    `
    })
