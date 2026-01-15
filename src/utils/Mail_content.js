// This is just the generation of the content to send the mail
import Mailgen from "mailgen"
import nodemailer from "nodemailer"


// This is branding from mailgen itself
// method
const SendEmail = async (options) => {
    // branding 
    const Mail_generator = new Mailgen({
        theme: "Default",
        product: {
            name: "Project_manager",
            link: "https://project_managmentworks.com"
        }
    })


    // constants which require input from the people 
    const Textualmail = Mail_generator.generatePlaintext(options.mail_content)
    const htmlmaill = Mail_generator.generate(options.Mail_generator)

    // Transporter file 
    const Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }

    })
    // Mail template , reuires two feilds of information from the person using it 
    const mail = {
        from: "Mailvriworkspace@exp.com",
        to: options.mail,
        subject: options.subject,
        text: Textualmail,
        html: htmlmaill
    }

    try {
        // use transporter with the method sendmail in which we pass the mail object we created 
        await Transporter.sendMail(mail)
    } catch (error) {
        console.error("Email error due to credentinoals (check .env file)", err)
    }
}


const mail_content = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: `Welcome Mr ${username} Excited to have you onboard`,
            action: {
                instructions: "To Verify your email Please click on the following button"
            },
            button: {
                color: "#80e9c6",
                text: "Verify  your email",
                link: verificationUrl
            },

        },
        outro: "Need help? , Communicate with us via this email"
    }
}


const forgortpass_mail_content = (username, passresetUrl) => {
    return {
        body: {
            name: username,
            intro: ` Mr ${username} Regarding password change `,
            action: {
                instructions: "To Reset Your password , Click below "
            },
            button: {
                color: "#45acec",
                text: "Reset Password",
                link: passresetUrl
            },

        },
        outro: "Need help? , Communicate with us via this email"
    }
}



export {
    mail_content,
    forgortpass_mail_content,
    SendEmail // now people can use this basically provide the options in it and send mail 
}