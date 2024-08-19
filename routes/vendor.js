// vendorRoutes.js
import express from "express";
import {
  VendorLogin,
  getAllVendors,
  createCategory,
  createProduct,
  getAllCategories,
  getAllProducts,
  getVendorProducts,
  editProduct,
  deleteProduct
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
router.post('/category', createCategory);
router.get('/categories', getAllCategories);
router.get('/products', getAllProducts);
router.post('/getVendorProducts', getVendorProducts);
router.put(
  '/editProduct/:id',
  upload.fields([{ name: "productImage", maxCount: 1 }]),
  editProduct
);
router.delete('/deleteProduct/:id', deleteProduct);

export default router;
