import express from "express";
import { addToCart, getCartItems, removeCartItem, clearCart } from "../controllers/cart.js";

const router = express.Router();

router.post('/addToCart', addToCart);
router.post('/getCartItems', getCartItems);
router.post('/removeCartItem', removeCartItem);
router.post('/clearCart', clearCart);

export default router;