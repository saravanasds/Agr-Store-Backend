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
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
  endpoint: "https://s3.ap-south-1.amazonaws.com", // Ensures usage of the IPv4 endpoint
  forcePathStyle: true, // Optional: Helps with path-style access
});

// -----------------------------------

const run = async () => {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log("Success", data.Buckets);
  } catch (err) {
    console.error("Error", err);
  }
};

run();
// -----------------------------------

// Multer setup
const storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKETNAME,
  metadata: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, {
      fieldname: file.fieldname + "-" + uniqueSuffix + "_" + file.originalname,
    });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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