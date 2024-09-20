// adminRoutes.js
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  addNewVendor,
  createDepartment,
  editDepartment,
  createCategory,
  getAllDepartments,
  getAllCategories,
  getAllAdmins,
  payHistory,
  getAllPayHistories,
  getVendorCommissions,
  getPayHistoriesByVendorEmail,
  distributeUserShare,
  offerProduct,
  getAllOfferProducts,
  editOfferProduct,
  deleteOfferProduct,
  createSetting,
  getSettings,
  updateSetting,
} from "../controllers/adminController.js";
import { upload } from "../config/uploadConfig.js";  // Import the common upload setup

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/all', getAllAdmins);
router.post('/addNewVendor', addNewVendor);
router.post(
  '/createDepartment',
  upload.fields([
    { name: "departmentImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  createDepartment
);
router.put(
  '/editDepartment/:id',
  upload.fields([
    { name: "departmentImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  editDepartment
);
router.post(
  '/createCategory',
  upload.fields([{ name: "categoryImage", maxCount: 1 }]),
  createCategory
);
router.get('/getAllDepartments', getAllDepartments);
router.get('/getAllCategories', getAllCategories);
router.post('/payVendor', payHistory);
router.get('/getAllPayHistories', getAllPayHistories);
router.get('/getVendorCommissions', getVendorCommissions);
router.get('/getPayHistoriesByVendorEmail/:vendorEmail', getPayHistoriesByVendorEmail);
router.post('/distributeUserShare', distributeUserShare);
router.post(
  "/offerProduct",
  upload.fields([{ name: "productImage", maxCount: 1 }]),
  offerProduct
);
router.get('/getAllOfferProducts', getAllOfferProducts);
router.put(
  '/editOfferProduct/:id',
  upload.fields([{ name: "productImage", maxCount: 1 }]),
  editOfferProduct
);
router.delete('/deleteOfferProduct/:id', deleteOfferProduct);

router.post(
  "/settings",
  upload.fields([
    { name: "offerImage", maxCount: 1 },  // Single offer image
    { name: "heroImages", maxCount: 10 }  // Multiple hero images
  ]),
  createSetting
);

router.get("/getSettings", getSettings);
router.put("/settings/:id", upload.fields([
  { name: "offerImage", maxCount: 1 },  // Optional for updates if you want to allow changing it
  { name: "heroImages", maxCount: 10 }  // Optional for updates if you want to allow changing it
]), updateSetting);


export default router;
