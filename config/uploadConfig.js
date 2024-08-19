import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
  endpoint: "https://s3.ap-south-1.amazonaws.com",
  forcePathStyle: true,
});

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

export const upload = multer({ storage: storage });
