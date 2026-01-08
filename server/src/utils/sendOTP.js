import sendEmail from "../config/mailer.js";
import { resetPasswordTemplate, verifyEmailTemplate } from "./emailTemplate.js";


export const sendOTP = async (user, purpose = "verify", otp)=>{
    if (purpose === "verify" && user.isEmailVerified) {
        throw new Error("User is already verified")
    }

    if (purpose === "resetPassword" && !user.isEmailVerified) {
        throw new Error("User must verify their email before resetting password");
    }
    
    if (!otp) {
        throw new Error("OTP is required to send email")
    }

    const { subject, html } = getEmailContent(purpose, user, otp);

    await sendEmail({
        to: user.email,
        subject,
        html
    })
};

const getEmailContent = (purpose, user, otp)=>{
    if (purpose === "verify") {
        return {
            subject: "Verify your email for VistaView",
            html:verifyEmailTemplate(user.name,otp)
        }
    }

    if (purpose === "resetPassword") {
        return {
            subject: "Reset your VistaView password",
            html:resetPasswordTemplate(user.name,otp)
        }
    }

    throw new Error(`Invalid OTP purpose ${purpose}`)
}