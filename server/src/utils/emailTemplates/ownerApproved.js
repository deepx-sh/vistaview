import baseTemplate from "./baseTemplate";

export const ownerApprovedTemplate = (name) => 
    baseTemplate({
        title: "Owner Verification Approved",
    content: `
      <p>Hi ${name},</p>
      <p>Great news! Your owner verification has been <strong>approved</strong>.</p>
      <p>You can now add and manage your tourism places on VistaView.</p>
    `
    })
