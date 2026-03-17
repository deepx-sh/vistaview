import { BrevoClient } from "@getbrevo/brevo";

const client = new BrevoClient({
    apiKey:process.env.BREVO_API_KEY
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        await client.transactionalEmails.sendTransacEmail({
            subject: subject,
            htmlContent: html,
            sender: {
                name: "VistaView",
                email:process.env.BREVO_FROM_EMAIL
            },
            to: [
                {
                    email:to
                }
            ]
        })
        console.log(`Successfully email sent to ${to}`);
        
    } catch (error) {
        console.error("Failed to send email");
        console.error(error.message);
        throw new Error("Email could not be sent")
    }
};


export default sendEmail