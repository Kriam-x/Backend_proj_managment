import Mailgen from "mailgen"
import nodemailer from "nodemailer"

// This function actually sends emails using nodemailer + mailgen
const SendEmail = async (options) => {
    // Mailgen branding setup
    const mailGen = new Mailgen({
        theme: "default",
        product: {
            name: "Project_manager",
            link: "https://project_managmentworks.com"
        }
    })

    // FIXED: previously you passed wrong option names (Email vs mail_content)
    // Generate text and HTML emails from mail content
    const textMail = mailGen.generatePlaintext(options.mail_content)
    const htmlMail = mailGen.generate(options.mail_content)

    // Transporter setup for SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })

    // Mail object
    const mail = {
        from: "Mailvriworkspace@exp.com",
        to: options.email, // FIXED: option name must match Postman / controller
        subject: options.subject,
        text: textMail,
        html: htmlMail
    }

    try {
        await transporter.sendMail(mail)
        console.log(`Email sent to ${options.email}`)
    } catch (err) {
        console.error("Email error due to credentials or connection", err)
    }
}

// Function to generate registration email content
const mail_content = (username, verificationUrl) => ({
    body: {
        name: username,
        intro: `Welcome ${username}, excited to have you onboard!`,
        action: {
            instructions: "To verify your email, click below:",
            button: {
                color: "#80e9c6",
                text: "Verify Your Email",
                link: verificationUrl
            }
        },
        outro: "Need help? Just reply to this email."
    }
})

// Optional: forgot password email content
const forgotpass_mail_content = (username, passResetUrl) => ({
    body: {
        name: username,
        intro: `Hi ${username}, you requested a password reset.`,
        action: {
            instructions: "Click below to reset your password",
            button: {
                color: "#45acec",
                text: "Reset Password",
                link: passResetUrl
            }
        },
        outro: "Need help? Reply to this email."
    }
})

export { SendEmail, mail_content, forgotpass_mail_content }

