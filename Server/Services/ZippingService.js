const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const logger = require("serverloggerjs/logger");
const log = new logger(true);
const { google, oauth2_v2, cloudfunctions_v1 } = require("googleapis");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const StudentService = require("./StudentService");
const Readable = require("stream").Readable;
const stringToStream = require("string-to-stream");
const { file } = require("googleapis/build/src/apis/file");

// function bufferToStream(buffer) {
//     var stream = new Readable();
//     stream.push(buffer);
//     stream.push(null);

//     return stream;
// }

// const changePermissions = async (drive, fileId) => {
//     try {
//         const resp = await drive.permissions.create({
//             fileId: fileId,
//             requestBody: {
//                 role: "reader",
//                 type: 'anyone'
//             }

//         })
//         return resp.status == 200 ? true : false
//     }
//     catch (err) {
//         console.log(err)
//         return false
//     }
// }

// const getLink = async (drive, fileId) => {
//     try {
//         const res1 = await drive.files.get({
//             fileId: fileId,
//             fields: 'webViewLink,webContentLink,iconLink,thumbnailLink'
//         })
//         return res1.data
//     }
//     catch (err) {
//         console.log(err)
//         return false
//     }
// }
// const addFilesToFolder = async (files, folderId, drive) => {

//     try {

//         for (let i = 0; i < files.length; i++) {

//             let fileId = files[i]
//             // Retrieve the existing parents to remove
//             const resp = await drive.files.get({
//                 fileId: fileId,
//                 fields: 'parents'
//             });
//             const parentFolderId = resp.data

//             if (parentFolderId) {
//                 const resp = await drive.files.update({
//                     fileId: fileId,
//                     addParents: folderId,
//                     removeParents: parentFolderId,
//                     fields: 'id, parents'
//                 })
//                 console.log(resp.data)
//             }
//             else {
//                 console.log(parentFolderId)

//                 return false
//             }
//         }
//         return true
//     }
//     catch (err) {
//         console.log(err)
//         return false
//     }
// }

function characterExists(MiddleName) {
  if (
    (MiddleName[0] >= "a" && MiddleName[0] <= "z") ||
    (MiddleName[0] >= "A" && MiddleName[0] <= "Z")
  ) {
    return MiddleName.toUpperCase();
  } else {
    return "";
  }
}

const downloadZipFile = async (
  fromDir,
  zipFileName,
  selectFileNames = "all"
) => {
  console.log("...................................");
  console.log("selectFileNames : ", selectFileNames);
  console.log("...................................");

  let cvPathName = path.join(
    __dirname,
    "..",
    "public",
    "student_details",
    "CV"
  );
  let zipPath = path.join(__dirname, "..", "public", "student_details", "Zips");

  console.log(fs.readdirSync(cvPathName));
  try {
    let filesToZip = [];
    if (selectFileNames == "all") {
      filesToZip = fs.readdirSync(cvPathName);
    } else {
      console.log(fs.readdirSync(cvPathName));
      console.log("Select File names here########");
      console.log(selectFileNames);
      fs.readdirSync(cvPathName).map((elem) => {
        let fileName = elem.split(".")[0];

        console.log("--------------------Filename------------------");
        console.log(fileName.split("-")[0]);
        console.log(selectFileNames);

        if (selectFileNames.includes(fileName.split("-")[0])) {
          filesToZip.push(elem);
          console.log(elem);
        }
      });
    }

    console.log("FILES TO ZIP&&&&&&&&&&&&&");
    console.log("filesToZip : ", filesToZip);
    let zip = new AdmZip();
    for (let i = 0; i < filesToZip.length; i++) {
      console.log("file to zip : ", filesToZip[i]);
      const studentData = await StudentService.getOneStudent(
        filesToZip[i].split("-")[0]
      );
      const studentDataJson = JSON.parse(JSON.stringify(studentData));
      const fullName =
        studentDataJson["FirstName"].toUpperCase() +
        "_" +
        characterExists(studentData["MiddleName"]) +
        "_" +
        studentDataJson["LastName"].toUpperCase();
      console.log("from line 136", fullName);
      console.log("HEREAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNN");
      fs.rename(
        path.join(cvPathName, filesToZip[i]),
        path.join(cvPathName, fullName + "." + filesToZip[i].split(".")[1]),
        () => {}
      );
      console.log("HEREAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNN");
      // let fileZippth = path.join(cvPathName, filesToZip[i])
      let fileZippth = path.join(
        cvPathName,
        fullName + "." + filesToZip[i].split(".")[1]
      );
      zip.addLocalFile(fileZippth);
      fs.rename(
        path.join(cvPathName, fullName + "." + filesToZip[i].split(".")[1]),
        path.join(cvPathName, filesToZip[i]),
        () => {}
      );
      console.log(fileZippth);
      console.log(filesToZip[i]);
    }
    let downloadName = zipFileName + ".zip";
    const data = zip.toBuffer();
    console.log("____________________________________________________\n");
    zip.writeZip(path.join(zipPath, downloadName));
    console.log("HERE");
    return data;
  } catch (err) {
    console.log(err.toString());
    log.error(err);
    log.error("Error creating Zip File!", err.toString());
    return false;
  }
};

const checkAndRemove = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
};

const downloadZipFileV1 = async (zipFileName, selectFileNames) => {
  try {
    let cvPathName = path.join(
      __dirname,
      "..",
      "public",
      "student_details",
      "CV"
    );
    let zipPath = path.join(
      __dirname,
      "..",
      "public",
      "student_details",
      "Zips"
    );

    console.log("selectFileNames : ", selectFileNames);

    let zip = new AdmZip();

    File_Paths = [];
    const folderPath = path.join(cvPathName, "Zips");
    fs.mkdirSync(folderPath);
    checkAndRemove(path.join(zipPath, zipFileName + ".zip"));
    selectFileNames.map(async (studentId) => {
      let studentData = await StudentService.getOneStudent(studentId);
      studentData = JSON.parse(JSON.stringify(studentData));
      if (
        studentData.CV_Upload == "image.png" ||
        studentData.CV_Upload == "" ||
        studentData.CV_Upload == undefined
      ) {
        // do nothing
      } else {
        const fileName = studentData.CV_Upload.split("/")[3];
        const originalFilePath = path.join(cvPathName, fileName);
        const fileExtension = fileName.split(".")[1];
        const renamedFileName =
          studentData.FirstName +
          "_" +
          studentData.MiddleName +
          "_" +
          studentData.LastName +
          "." +
          fileExtension;
        const destPath = path.join(folderPath, renamedFileName);
        console.log("ORIGINAL:", originalFilePath);

        fs.copyFileSync(originalFilePath, destPath, fs.constants.COPYFILE_EXCL);
      }
    });
    setTimeout(() => {
      zip.addLocalFolder(folderPath);
      zip.writeZip(path.join(zipPath, zipFileName + ".zip"));
      fs.rmdirSync(folderPath, { recursive: true });
      return true;
    }, 500);
    return true;
  } catch (err) {
    log.error(err.toString());
    return false;
  }
};

module.exports = {
  downloadZipFile,
  downloadZipFileV1,
  // createSharedFolderLink
};
