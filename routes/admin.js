// adminRoutes.js
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  addNewVendor,
  createDepartment,
  createCategory,
  getAllDepartments,
  getAllCategories
} from "../controllers/adminController.js";
import { upload } from "../config/uploadConfig.js";  // Import the common upload setup

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/addNewVendor', addNewVendor);
router.post(
  '/createDepartment',
  upload.fields([{ name: "departmentImage", maxCount: 1 }]),
  createDepartment
);
router.post(
    '/createCategory',
    upload.fields([{ name: "categoryImage", maxCount: 1 }]),
    createCategory
  );
router.get('/getAllDepartments', getAllDepartments);
router.get('/getAllCategories', getAllCategories);

export default router;
