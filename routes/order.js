import express from "express";
import { placeOrder, getUserOrders, getAllOrders, getOrderProductsByVendorEmail, updateOrderStatus } from "../controllers/order.js";

const router = express.Router();

router.post('/placeOrder', placeOrder);
router.post('/getUserOrders', getUserOrders);
router.get('/getAllOrders', getAllOrders);
router.get('/getVendorOrders/:vendorEmail', getOrderProductsByVendorEmail);
router.put('/updateOrderStatus/:id', updateOrderStatus);

export default router;