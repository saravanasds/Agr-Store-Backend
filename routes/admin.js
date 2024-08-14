import express from "express";
import { registerAdmin, loginAdmin, addNewVendor, createDepartment, getAllDepartments } from "../controllers/adminController.js";

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/addNewVendor', addNewVendor);
router.post('/createDepartment', createDepartment);
router.get('/getAllDepartments', getAllDepartments);

export default router;
