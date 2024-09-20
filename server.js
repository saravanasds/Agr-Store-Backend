import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRegisterRoute from "./routes/user.js";
import adminRoute from "./routes/admin.js";
import vendorRoute from "./routes/vendor.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";
import { dataBaseConnection } from "./config/database.js";
import Razorpay from 'razorpay';

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

dataBaseConnection();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Routes
app.use('/api/user', userRegisterRoute);
app.use('/api/admin', adminRoute);
app.use('/api/vendor', vendorRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);

// Example route to create Razorpay order (if needed)
app.post('/api/order/createOrder', async (req, res) => {
    try {
        const { amount, currency, receipt } = req.body;
        // console.log('Order data:', req.body);
        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency,
            receipt,
        };
        const order = await razorpay.orders.create(options);
        // console.log(order);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
