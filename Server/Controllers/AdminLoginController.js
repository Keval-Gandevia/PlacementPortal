const db = require("../Models")
const multer = require('multer');
const logger = require("serverloggerjs/logger")
const log = new logger(true)
const ResponseService = require("../Services/ResponseService")
const OK = ResponseService.OK
const ERROR = ResponseService.ERROR
const RESP = ResponseService.RESP
const AdminLogin = db.adminLogins
const AdminLoginService = require("../Services/AdminLoginService")

const login = async (req, res) => {
    try {
        const admin_name = req.body.adminName
        const admin_password = req.body.adminPassword
        console.log("body fromn controller");
        console.log("admin name: ", admin_name)
        console.log("admin password", admin_password)

        const token = await AdminLoginService.verifyAdmin(admin_name, admin_password)

        console.log("token: ", token)

        if (token) {
            const savedCookie = await res.cookie("AdminLoginToken", token, {
                expires: new Date(Date.now() + 2589200000),
                httpOnly: true,
            });
            return OK(res, "Admin Logged in successfully!!")
        }
        else {
            throw "Error in generating token!"
        }
    }
    catch (e) {
        log.error(e.toString())
        // res.json({ status: false, data: e.toString() })
        return ERROR(res, "Wrong admin name or password!")
    }
}

const changePassword = async (req, res) => {
    try {

        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        const newPasswordConfirm = req.body.newPasswordConfirm

        const status = await AdminLoginService.changePassword(oldPassword, newPassword, newPasswordConfirm)

        console.log("status : ", status)

        if (status == true) {
            await res.clearCookie('AdminLoginToken')
            return OK(res, "Password updated successfully. Please login again")
        }

        else {
            return ERROR(res, status)
        }

    } catch (error) {
        console.log(error)
        return ERROR(res, "Cannot set your password!")
    }
}

module.exports = {
    login,
    changePassword
}