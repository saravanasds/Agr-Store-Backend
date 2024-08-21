import express from "express";
import { addToCart, getCartItems } from "../controllers/cart.js";

const router = express.Router();

router.post('/addToCart', addToCart);
router.post('/getCartItems', getCartItems);

export default router;