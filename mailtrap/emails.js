import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email Sent Successfully", response)
    } catch (error) {
        console.log(`Error sending verification`, error)
        throw new Error(`Error sending verification email : ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "a2ad010d-c1a5-4254-95db-c5479582673e",
            template_variables: {
                name: name,
                company_info_name: "Roadrims Logistics"
              }
        })

        console.log("Welcome email sent successfully", response)
    } catch (error) {
        console.log(`Error sending welcome email`, error);
        throw new Error(`Error Sending Welcome Email: ${error}`)        
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recepient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "Reset your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })
    } catch (error) {
        console.log(`Error sending password reset email`, error);

        throw new Error(`Error sending password reset email: ${error}`)
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recepient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Resset Success"
        })
    } catch (error) {
        console.log(`Error sending password reset sucessful email`, error);

        throw new Error(`Error sending password reset successful email: ${error}`)
    }
}