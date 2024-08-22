const multer = require("multer");

const router = require("express").Router();

const ReportController = require("../Controllers/ReportsController");

const AdminAuthenticate = require("../Middlewares/Admin/AdminAuthenticate");

router.post(
  "/getPlacementReportByBatchYear",
  [AdminAuthenticate.AdminAuthenticate],
  ReportController.getPlacementReportByBatchYear
);

router.post(
  "/multiplePlacements",
  [AdminAuthenticate.AdminAuthenticate],
  ReportController.multiplePlacements
);

router.post(
  "/placedStudentsByCompany",
  [AdminAuthenticate.AdminAuthenticate],
  ReportController.placedStudentsByCompany
);

router.get(
  "/singleCompanyDetails/:id/:batch_year",
  [AdminAuthenticate.AdminAuthenticate],
  ReportController.singleCompanyDetails
);

router.post(
  "/studentsInterestedInHigherStudies",
  [AdminAuthenticate.AdminAuthenticate],
  ReportController.studentsInterestedInHigherStudies
);

router.post(
  "/unplacedStudents",
  [AdminAuthenticate.AdminAuthenticate],
  ReportController.unplacedStudents
);

router.post(
  "/unplacedInternship",
  [AdminAuthenticate.AdminAuthenticate],
  ReportController.unplacedInternship
);

module.exports = router;
