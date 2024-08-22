const logger = require("serverloggerjs/logger")
const log = new logger(true)

const AddRequirementToAnnouncement = async (data) => {



    const payload = {
        Announcement_ID: data.Announcement_ID,
        type: data.type
    }

}