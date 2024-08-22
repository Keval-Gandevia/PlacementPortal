const Subscibe = require("../Services/AnnouncementSubscribe")
const logger = require("serverloggerjs/logger")
const log = new logger(true)
const AnnouncementService = require("../Services/AnnouncementService")
const AnnouncementSubscribeService = require("../Services/AnnouncementSubscribe")
const ZippingService = require("../Services/ZippingService")
const ResponseService = require("../Services/ResponseService")
const OK = ResponseService.OK
const ERROR = ResponseService.ERROR

const addStudentToAnnouncement = async (req, res) => {
    try {
        const jobPreferenceList = req.body

        console.log("job preference data in req.body : ", jobPreferenceList)

        let jobPreferences = "";

        jobPreferences += jobPreferenceList["JobPreferences"]

        for (let i = 1; i < jobPreferenceList.length; i++) {
            jobPreferences += ","
            jobPreferences += jobPreferenceList[i]
        }

        console.log("job preference data created as string : ", jobPreferences)

        const AdditionalFieldData = JSON.stringify(jobPreferenceList["AdditionalData"])

        const studentId = req.userId
        const studentMailId = req.userObj.Email_ID
        const status = await Subscibe.addSubsriberToAnnouncement(studentId, req.params.announcementId, studentMailId, jobPreferences,AdditionalFieldData)

        console.log("status  : ", status)

        if (status?.status) {
            return res.json({ status: true, data: "Announcement applied successfully!" })
        }
        else if (status?.status == false) {
            return res.json({ status: false, data: status.data.err})
        }
        else {
            throw "Error in Subscribing student. Status returned false."
        }
    }
    catch (err) {
        console.log(err.toString());
        log.error(err.toString())
        return res.json({ status: false, data: "Error! While applying to announcement!" })
    }
}


const getSubscribedStatus = async (req, res) => {
    try {
        const studentId = req.userId
        const status = await Subscibe.getSubscribedStatus(studentId, req.params.announcementId)

        // console.log("status : ", status)

        if (status?.status) {
            console.log("HJERELKNDKNKLSNKLNFKLNSLKNLKFNLKFNSLKNFLKSNFLK")
            let payLoad = { status: true, data: {"JobPreference":status.Job_Preferences,"additionaldata":status.AdditionalData} } 
            console.log(payLoad)
            return res.json(payLoad)
        }
        else {
            console.log("Responding from here")
            return res.json({ status : false, data : "Please fill out all the fields" })
        }
    }
    catch (err) {
        console.log(err.toString());
        log.error(err.toString())
        return res.json({ status: false, data: "Error! While fetching status!" })
    }
}


const removeStudentToAnnouncement = async (req, res) => {
    try {
        const studentId = req.userId
        const status = await Subscibe.removeSubscribedStatus(studentId, req.params.announcementId)

        if (status) {
            return res.json({ status: true })
        }
        else {
            return res.json({ status: false })
        }
    }
    catch (err) {
        console.log(err.toString());
        log.error(err.toString())
        return res.json({ status: false, data: "Error! While fetching status!" })
    }
}

const getSubscribedAnnouncements = async (req, res) => {
    try {
        // const student_id = "19CEUOS003"
        const student_id = req.userId
        const data = await Subscibe.getSubscribedAnnouncements(student_id)
        if (data) {
            return res.json({ status: true, data: data })
        }
    }
    catch (err) {
        console.log(err.toString());
        log.error(err.toString())
        return res.json({ status: false, data: "Error! While fetching subscribed announcements!" })
    }
}


const getSubscribedStudentsOfAnnouncement = async (req, res) => {
    try {
        const announcement_id = req.params.announcementId
        const data = await Subscibe.getSubscribedStudentsOfAnnouncement(announcement_id, true)
        if (data) {
            return res.json({ status: true, data: data })
        }

    }
    catch (err) {
        console.log(err.toString());
        log.error(err.toString())
        return res.json({ status: false, data: "Error! While fetching subscribed students!" })
    }
}

const downloadSubscribedStudentZip = async (req, res) => {
    // try {
    //     const announcement_id = req.params.announcementId
    //     let announcement_details = await AnnouncementService.getAnnoucement(announcement_id)
    //     // console.log(JSON.parse(JSON.stringify(announcement_details)));
    //     const zipName = announcement_id + "_" + announcement_details[0]["Company_details"]["Company_name"] + "_" + announcement_details[0]["Job_Role"]
    //     // console.log(zipName);
    //     const subscribedStudents = await AnnouncementSubscribeService.getSubscribedStudentsOfAnnouncement(announcement_id)
    //     const subscribedStudentList = []
    //     const filesList = []
    //     subscribedStudents.map((student) => {
    //         subscribedStudentList.push(
    //             student["Student_ID"])

    //         filesList.push(student["CV_Upload"])
    //     })
    //     // console.log("ehjk");
    //     // console.log(subscribedStudentList);
    //     // const data = await ZippingService.downloadZipFile("../public/student_details/CV/", zipName, subscribedStudentList)

    //     const resp = await ZippingService.createSharedFolderLink(subscribedStudentList, filesList, zipName)

    //     return OK(res, resp);
    // }
    // catch (err) {
    //     console.log(err.toString());
    //     log.error(err.toString())
    //     return res.json({ status: false, data: "Error Fetching student data!" })
    // }
    try {
        const announcement_id = req.params.announcementId
        let announcement_details = await AnnouncementService.getAnnoucement(announcement_id)
        // console.log(JSON.parse(JSON.stringify(announcement_details)));
        const zipName = announcement_id + "_" + announcement_details[0]["Company_details"]["Company_name"]
        // console.log(zipName);
        const subscribedStudents = await AnnouncementSubscribeService.getSubscribedStudentsOfAnnouncement(announcement_id)
        const subscribedStudentList = []
        // console.log("subscribed student : ", subscribedStudents)
        subscribedStudents.map((student) => {
            subscribedStudentList.push(student["studentDetails"]["Student_ID"])
        })
        console.log("subscribed students : ", subscribedStudentList)
        // const data = await ZippingService.downloadZipFile("../public/student_details/CV/", zipName, subscribedStudentList)
        const data = await ZippingService.downloadZipFileV1(zipName,subscribedStudentList);
        if(data)
        {
            return OK(
              res,
              process.env.NODE_ENV=="prodction"?"http://placement.ceddu.in/public/student_details/Zips"+zipName+".zip":
              "http://localhost:8000/public/student_details/Zips/" + zipName + ".zip"
            );
            // http://localhost:8000/student_details/Zips/1_Amazion.zip
        }
        else
        {
            return ERROR(res,"File system error!")
        }
        return res.send("Hello")

        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${zipName
            }.zip`);
        res.set('Content-Length', data.length);
        return res.send(data);
    }
    catch (err) {
        console.log(err.toString());
        log.error(err.toString())
        return res.json({ status: false, data: "Error! While downloading zip!" })
    }


}

const sendSubscribedStudentsMail = async (req, res) => {
    try {
        let announcementIdx = req.params.id
        let data = req.body.data
        log.info(JSON.stringify(req.body))
        const payload = {
            subject: req.body.Subject,
            header: req.body.Header,
            body: req.body.Body
        }
        let status = await Subscibe.sendSubscribedStudentsMail(announcementIdx, payload)
        if (status) {
            return OK(res, "Mail sent to students successfully!")
        }
        else {
            throw "While sending subscribed students mail status returned false."
        }
    }
    catch (err) {
        log.error(err.toString());
        return ERROR(res, "Error sending mail to students.")
    }
}

module.exports = {
    addStudentToAnnouncement,
    getSubscribedAnnouncements,
    getSubscribedStatus,
    removeStudentToAnnouncement,
    getSubscribedStudentsOfAnnouncement,
    downloadSubscribedStudentZip,
    sendSubscribedStudentsMail
}