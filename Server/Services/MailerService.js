require("dotenv").config();
const logger = require("serverloggerjs/logger")
const log = new logger(true)
const db = require("../Models/index")
const nodemailer = require('nodemailer')
const { google } = require("googleapis")
const EmailId = process.env.EMAIL_ID
const EmailPassword = process.env.EMAIL_PASSWORD
const EmailService = process.env.EMAIL_SERVICE

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

console.log("Client ID", CLIENT_ID)
console.log("Client SECRET", CLIENT_SECRET)
console.log("Client URI", REDIRECT_URI)

async function sendMail(mailDetails) {

    try {
        // let mailTransporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     port: 587,
        //     secure: true,
        //     auth: {
        //         user: EmailId,
        //         pass: EmailPassword
        //     }
        // });
        // let result = await mailTransporter.sendMail(mailDetails)
        // if (result) {
        //     // console.log("Here in true")
        //     return true
        // }
        // else {
        //     // console.log("Here in false")
        //     return false
        // }

        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'abcxyz1814@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        // const mailOptions = {
        //     from: 'placement.csiddu.tech',
        //     to: 'jenilgandhi2111@gmail.com',
        //     subject: 'Hello from gmail using API',
        //     text: 'Hello from gmail email using API',
        //     html: '<h1>Hello from gmail email using API</h1>',
        // };
        const result = await transport.sendMail(mailDetails);
        // console.log(result)
        if (result) {
            return true
        }
        else {
            return false
        }

    }
    catch (err) {
        console.log("Some error")
        console.log(err)
        return false
    }

    // let mailTransporter = nodemailer.createTransport({
    //     service: process.env.EMAIL_SERVICE,
    //     auth: {
    //         user: process.env.EMAIL_ID,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });
}


const notificationMail = async (notificationData, to) => {
    try {
        let mailDetails = {
            from: 'placementportal@csiddu.tech',
            to: to,
            subject: notificationData.subject,
            html: `<!DOCTYPE html>
            <html>
            <head>
            

            </head>
            <body>
                <div style="width:800px; margin:0 auto; text-align: center; background: #F55734">
                    <i>
                        <h2 style="color: white; padding: 2%;">
                            CE DEPARTMENT, DHARMSINH DESAI UNIVERSITY
                        </h2>
                    </i>
                </div>
                <hr style="max-width:800px; margin:0 auto;">
                <div style="max-width:800px; margin:0 auto; min-height: 500px; background: #e7e9eb">
                    <h1 style="padding-left: 20px; padding-top: 20px;">
                        ${notificationData.header}
                    </h1>
                    <p style="padding-left: 20px;">
                        ${notificationData.body}
                    </p>
                </div>
                <hr style="max-width:800px; margin:0 auto;">
                <div style="width:800px; margin:0 auto; text-align: center; background: #706e6f">
                    <i>
                        <h2 style="color: white; padding: 2%;">
                            &copy;CE DEPARTMENT, DHARMSINH DESAI UNIVERSITY PLACEMENT PORTAL
                        </h2>
                    </i>
                </div>
            </body>
            </html>
            `

        };

        const status = await sendMail(mailDetails)
        console.log(`> Mail sent to ${to} successfully`)
        return status
    }
    catch (err) {
        log.error(err.toString())
        console.log(err)
        return false
    }
}

const batchNotificationMail = async (notificationData, students_list) => {
    try {
        let mailDetails = {
            from: 'placementportal@csiddu.tech',
            to: students_list,
            subject: notificationData.subject,
            html: `<!DOCTYPE html>
            <html>
            <head>
            

            </head>
            <body>
                <div style="width:800px; margin:0 auto; text-align: center; background: #F55734">
                    <i>
                        <h2 style="color: white; padding: 2%;">
                            CE DEPARTMENT, DHARMSINH DESAI UNIVERSITY
                        </h2>
                    </i>
                </div>
                <hr style="max-width:800px; margin:0 auto;">
                <div style="max-width:800px; margin:0 auto; min-height: 500px; background: #e7e9eb">
                    <h1 style="padding-left: 20px; padding-top: 20px;">
                        ${notificationData.header}
                    </h1>
                    <p style="padding-left: 20px;">
                        ${notificationData.body}
                    </p>
                </div>
                <hr style="max-width:800px; margin:0 auto;">
                <div style="width:800px; margin:0 auto; text-align: center; background: #706e6f">
                    <i>
                        <h2 style="color: white; padding: 2%;">
                            &copy;CE DEPARTMENT, DHARMSINH DESAI UNIVERSITY PLACEMENT PORTAL
                        </h2>
                    </i>
                </div>
            </body>
            </html>
            `

        };

        const status = await sendMail(mailDetails)
        console.log(`> Mail sent to ${to} successfully`)
        return status
    }
    catch (err) {
        log.error(err.toString())
        console.log(err)
        return false
    }
}

const subscribeMail = async (announcementData) => {

    try {

    }
    catch (err) {
        log.error(err.toString())
        return false
    }
}

module.exports = {
    notificationMail,
    subscribeMail,
    batchNotificationMail
}