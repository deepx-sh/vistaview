import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `VistaView - <${process.env.SENDGRID_FROM_EMAIL}>`,
            to,
            subject,
            html
        }

        await sgMail.send(mailOptions);
        console.log(`Successfully email sent to ${to}`);
    } catch (error) {
        console.error("Failed to send email");

        if (error.response) {
            console.error(error.response.body);
        } else {
            console.error(error.message);
        }
        throw new Error("Email could not be sent")
    }
};

export default sendEmail;