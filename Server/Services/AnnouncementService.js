const logger = require("serverloggerjs/logger")
const multer = require('multer');
const path = require('path');
const { announcements } = require("../Models/index")
const log = new logger(true)
const db = require("../Models/index")
const CompanyService = require("./CompanyService");
const BranchAnnouncementService = require("./BranchAnnouncementService")
const AnnouncementSubscribeService = require("./AnnouncementSubscribe");
// const AnnouncementHelper = require('./HelperServices/AnnouncementHelper')
const NotificationService = require("./NotificationService");
// const AnnouncementSubscribe = require("../Models/AnnouncementSubscribe");
const Announcement = db.announcements
const { sequelize } = require("../Models/index")
const Sequelize = require("sequelize")
const StudentModel = db.students
const MailerService = require("./MailerService")
const Company = db.companies
const ParseDate = require("../Helper/ParseDate")

async function checkExists(id) {
    const announcements = await Announcement.findAll({
        where: { Announcement_ID: id }
    })
    return announcements.length > 0 ? true : false
}

const createdAnnoucement = async (announcementData, job_description_file) => {
    try {
        console.log("from create announcement : ", announcementData)
        // const dat = Date.parse(announcementData["Date_of_Visit"])
        // const fileName = "./public/" + announcementData["Company_ID"] + "-" + dat.toString() + ".pdf"
        const fileName = job_description_file
        if (fileName != null || fileName != "" || fileName != undefined) {

            announcementData["Job_Description_File"] = fileName
        }
        else {
            announcementData["Job_Description_File"] = ""
        }
        // announcementData["Company_ID"] = 3 // Temporary static
        announcementData["IsOpen"] = true // Temporary static
        const branches = announcementData["Eligible_Branches"].split(",")
        // console.log(branches)
        announcementData["Eligible_Branches"] = ""
        if (announcementData["Job_Preferences"] == "") {
            announcementData["Job_Preferences"] = null
        }
        await Announcement.create(announcementData)
        let aData = await Announcement.findAll({
            order: [
                ['Announcement_ID', 'DESC'],
            ],
        })
        aData = JSON.parse(JSON.stringify(aData))[0]
        console.log("FileName", fileName)
        // console.log("Here", JSON.parse(JSON.stringify(aData))[0])
        for (let i = 0; i < branches.length; i++) {
            const status = await BranchAnnouncementService.addBranchToAnnouncement(aData.Announcement_ID, branches[i])
        }
        // console.log("announcement id: " + aData.Announcement_ID)
        if (announcementData.sendMail === "true") {
            // console.log("in announcement email")
            await sendAnnouncementEmailNotification(aData.Announcement_ID, announcementData.Passed_out_year, announcementData.Company_ID, announcementData.Registration_Deadline, announcementData.Job_Role)
        }
        return true
    }
    catch (err) {
        log.error(err.toString())
        return false
    }
}

const sendAnnouncementEmailNotification = async (announcementId, year, companyId, registrationDeadline, jobRole) => {
    try {
        // console.log("in email")
        // year = parseInt(year)
        // year = year.getYear()
        let y = year.split(" ")
        y = y[3]
        console.log(y)

        var students = await StudentModel.findAll({ where: [sequelize.where(sequelize.fn('YEAR', sequelize.col('Passed_out_year')), y)] })

        students = JSON.parse(JSON.stringify(students))
        // console.log("from email notification: ", students)

        let email_list = [];

        for (let i = 0; i < students.length; i++) {
            let student = students[i]
            let email = student["Email_ID"]
            if (email !== "") {
                email_list.push(email)
            }
            // console.log(email)
        }

        // console.log("email list: " + email_list)

        function tConvert(time) {
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) {
                time = time.slice(1)
                time[5] = +time[0] < 12 ? ' AM' : ' PM'
                time[0] = +time[0] % 12 || 12
            }
            return time.join('')
        }
        registrationDeadline = registrationDeadline.split(" ")
        let time = registrationDeadline[4]
        time = time.slice(0, -3)
        time = tConvert(time)
        let deadline = registrationDeadline[0] + " " + registrationDeadline[1] + " " + registrationDeadline[2] + " " + registrationDeadline[3] + " " + time

        let company = await Company.findAll({ where: { Company_ID: companyId }, raw: true })
        let companyName = company[0]["Company_name"]

        // console.log("Company name: ", companyName)
        // console.log("Job role: " + jobRole)
        // console.log("Registration deadline: " + deadline)

        await MailerService.batchNotificationMail({
            "subject": "NEW ANNOUNCEMENT - PLACEMENT PORTAL - CE DEPARTMENT, DHARMSINH DESAI UNIVERSITY", "header": "New Announcement Opened", "body": `Overview of the new announcement opened:<br/><br/><b>Company name: </b>${companyName}<br/><b>Job role: </b>${jobRole}<br/><b>Registration deadline: </b>${deadline}<br/><br/>Please visit <a href="${process.env.DOMAIN}_student/announcement/view_announcement/${announcementId}">${process.env.DOMAIN}_student/announcement/view_announcement</a> to view full announcement details. And Apply to this announcement if interested before registration deadline as specified above.<br/><br/><b>NOTE: Please mail to jatayubaxi.ce@ddu.ac.in incase you face any issue while viewing the announcement details in the placement portal web application.</b>`
        }, email_list
        )
    }
    catch (err) {
        log.error(error.toString())
        return false
    }
}

const getAllAnnoucements = async (Passed_out_year = "all") => {
    try {
        let announcements;
        if (Passed_out_year == "all") {

            announcements = await Announcement.findAll({
                order: [
                    ['Announcement_ID', 'DESC']]
            })
        }
        else {
            let year = new Date(Date.now())
            year.setDate(0)
            year.setMonth(0)
            year.setFullYear(parseInt(Passed_out_year))
            log.info(year)
            announcements = await Announcement.findAll({
                where: sequelize.where(sequelize.fn('YEAR', sequelize.col('Passed_out_year')), year),
                order: [
                    ['Announcement_ID', 'DESC']]
            })
        }
        if (announcements) {
            announcements = JSON.parse(JSON.stringify(announcements))
            for (let i = 0; i < announcements.length; i++) {
                const company = await CompanyService.getCompany(announcements[i].Company_ID)
                announcements[i]["Company_details"] = JSON.parse(JSON.stringify(company))
            }
        }
        return announcements
    } catch (error) {
        log.error(error.toString())
        return false
    }
}

const getAnnoucement = async (id) => {
    try {
        const status = await checkExists(id)
        if (!status) {
            throw "Error finding announcement detials"
        }
        else {
            let announcement = await Announcement.findAll({
                where: { Announcement_ID: id }
            })
            announcement = JSON.parse(JSON.stringify(announcement))

            // console.log(JSON.parse(JSON.stringify(announcement)));
            let company = await CompanyService.getCompany(announcement[0].Company_ID)
            announcement[0]["Company_details"] = company

            let branches = await BranchAnnouncementService.getBranchesOfAnnouncement(announcement[0]["Announcement_ID"])
            branches = JSON.parse(JSON.stringify(branches))

            announcement[0]["Eligible_Branches"] = branches

            return announcement
        }
    } catch (error) {
        log.error(error.toString() + id)
        return false
    }
}

const updateAnnoucement = async (data, id, sendNotification = false, job_description_file = "") => {
    try {
        const status = await checkExists(id)
        if (!status) {
            throw "Announcement doesn't exist"
        }
        else {
            // console.log(JSON.parse(JSON.stringify(data)))
            // console.log(data["Eligible_Branches"])
            const fileName = job_description_file
            // console.log("filename: " + fileName)
            if (fileName != null || fileName != "" || fileName != undefined) {

                data["Job_Description_File"] = fileName
            }
            if (fileName == "") {
                // console.log(`in filename == ""`)
                data["Job_Description_File"] = null
            }
            // console.log("File name", fileName == "")
            // return false
            // data["Job_Description_File"] = fileName
            await BranchAnnouncementService.deleteBranchesOfAnnouncement(id)
            let branches = data["Eligible_Branches"].split(",")
            for (let i = 0; i < branches.length; i++) {
                await BranchAnnouncementService.addBranchToAnnouncement(id, branches[i])
                // console.log(branches[i])
            }
            data["Eligible_Branches"] = ""
            // console.log("hello rikin")
            const announcement = await Announcement.update(data, { where: { Announcement_ID: id } })

            // console.log("hi rikin")
            // console.log("bye rikin")
            // console.log("passed out year in update: " + data["Passed_out_year"])
            console.log("data.sendMAil : ", typeof data.sendMail)
            if (data?.sendMail == "true") {
                // console.log("in announcement email")
                await sendUpdateAnnouncementEmailNotification(id, data["Passed_out_year"], data["Company_ID"], data["Job_Role"], data["Registration_Deadline"])
            }
            // console.log("goodbye rikin")

            // console.log("hello rikin")
            // if (sendNotification) {
            //     let students = await AnnouncementSubscribeService.getSubscribedStudentsOfAnnouncement(id)
            //     students = JSON.parse(JSON.stringify(students))
            //     const student_list = []
            //     for (let i = 0; i < students.length; i++) {
            //         student_list.push(students[i].Student_ID)
            //     }

            //     // console.log(student_list)

            //     const announcementDetails = await getAnnoucement(id)
            //     console.log("hello rikin 1")

            //     const message = announcementDetails[0]["Company_details"]["Company_name"] + " " + announcementDetails[0]["Job_Role"] + " has been updated. Please check the updated announcement details!"

            //     const mailData = {
            //         "subject": "DDU Placement Cell - " + announcementDetails[0]["Company_details"]["Company_name"] + " announcement has been updated!",
            //         "header": message,
            //         "body": ""
            //     }

            //     console.log("hello rikin 2")

            //     const status = await NotificationService.adminToBatchNotification(student_list, message, true, mailData)

            //     console.log("hello rikin 3")

            //     if (status) {
            //         return true
            //     }
            //     else {
            //         console.log("hello rikin 4")
            //         throw "Error in sending the notifications!!"
            //     }

            // }

            // console.log("hello rikin")
            return true
        }
    } catch (error) {
        log.error(error.toString())
        return false
    }
}

const sendUpdateAnnouncementEmailNotification = async (announcementId, year, companyId, jobRole, registrationDeadline) => {
    try {

        // console.log("year from update " + year)

        let y = year.split("-")
        y = y[0]
        console.log(y)

        var students = await StudentModel.findAll({ where: [sequelize.where(sequelize.fn('YEAR', sequelize.col('Passed_out_year')), y)] })

        students = JSON.parse(JSON.stringify(students))
        // console.log("from email notification: ", students)

        let email_list = [];

        for (let i = 0; i < students.length; i++) {
            let student = students[i]
            let email = student["Email_ID"]
            if (email !== "") {
                email_list.push(email)
            }
            // console.log(email)
        }

        // console.log("email list: " + email_list)

        let deadline = ParseDate.ParseDate(registrationDeadline, true)

        let company = await Company.findAll({ where: { Company_ID: companyId }, raw: true })
        let companyName = company[0]["Company_name"]

        console.log("Company name: ", companyName)
        console.log("Job role: " + jobRole)
        console.log("Registration deadline: " + deadline)

        await MailerService.batchNotificationMail({
            "subject": "ANNOUNCEMENT DETAILS UPDATED - PLACEMENT PORTAL - CE DEPARTMENT, DHARMSINH DESAI UNIVERSITY", "header": "Announcement Details Updated", "body": `<b>Company name: </b>${companyName}<br/><b>Job role: </b>${jobRole}<br/><b>Registration deadline: </b>${deadline}<br/><br/>Announcement details for the above mentioned company is updated. Please visit <a href="${process.env.DOMAIN}_student/announcement/view_announcement/${announcementId}">${process.env.DOMAIN}_student/announcement/view_announcement</a> to view full updated announcement details. And apply to this announcement if interested and still not applied before registration deadline as specified above.<br/><br/><b>NOTE: Please mail to jatayubaxi.ce@ddu.ac.in incase you face any issue while viewing the announcement details in the placement portal web application.</b>`
        }, email_list
        )
    } catch (error) {
        log.error(error.toString())
        return false
    }
}

const deleteAnnoucement = async (id) => {
    try {
        const status = await checkExists(id)
        if (!status) {
            throw "Error deleting announcement"
        }
        else {
            await Announcement.destroy({ where: { Announcement_ID: id } })
            return true
        }
    } catch (error) {
        log.error(error.toString())
        return false
    }
}

module.exports = {
    createdAnnoucement,
    getAllAnnoucements,
    getAnnoucement,
    updateAnnoucement,
    deleteAnnoucement,
    sendAnnouncementEmailNotification,
    sendUpdateAnnouncementEmailNotification
}