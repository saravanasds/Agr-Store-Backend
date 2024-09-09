// vendorRoutes.js
import express from "express";
import {
  VendorLogin,
  getAllVendors,
  getVendorByEmail,
  createCategory,
  createProduct,
  getAllCategories,
  getAllProducts,
  getVendorProducts,
  editProduct,
  deleteProduct,
  getSingleProduct,
  updateVendorStatus
} from "../controllers/vendor.js";
import { upload } from "../config/uploadConfig.js"  // Import the common upload setup

const router = express.Router();

router.post(
  "/addProduct",
  upload.fields([{ name: "productImage", maxCount: 1 }]),
  createProduct
);

router.post('/login', VendorLogin);
router.get('/all', getAllVendors);
router.get('/getVendorByEmail/:vendorEmail', getVendorByEmail);
router.post('/category', createCategory);
router.get('/categories', getAllCategories);
router.get('/getAllProducts', getAllProducts);
router.post('/getVendorProducts', getVendorProducts);
router.put(
  '/editProduct/:id',
  upload.fields([{ name: "productImage", maxCount: 1 }]),
  editProduct
);
router.delete('/deleteProduct/:id', deleteProduct);
router.get('/getProduct/:id', getSingleProduct);
router.put("/:id/status", updateVendorStatus);

export default router;
