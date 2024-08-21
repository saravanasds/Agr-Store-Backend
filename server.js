import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRegisterRoute from "./routes/user.js";
import adminRoute from "./routes/admin.js"
import vendorRoute from "./routes/vendor.js"
import cartRoute from "./routes/cart.js";
import { dataBaseConnection } from "./config/database.js";

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

// Middleware
// const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_DASHBOARD_URL];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
// const mongoURI = process.env.MONGODB_URI;
// mongoose.connect(mongoURI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));
dataBaseConnection();

// Routes
app.use('/api/user', userRegisterRoute);
app.use('/api/admin', adminRoute);
app.use('/api/vendor', vendorRoute);
app.use('/api/cart', cartRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
