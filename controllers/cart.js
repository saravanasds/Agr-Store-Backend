import Cart from "../models/cart.js";
import mongoose from "mongoose";



// Add product to cart
const addToCart = async (req, res) => {
    const { email, productId, quantity, unit, price, productImage } = req.body;
    console.log(req.body);

    try {
        // Convert productId to ObjectId using `new`
        const objectId = new mongoose.Types.ObjectId(productId);

        let cart = await Cart.findOne({ email });

        if (cart) {
            // Check if the product already exists in the cart
            const productIndex = cart.products.findIndex(p => p.productId.equals(objectId));

            if (productIndex > -1) {
                // Update quantity if product exists
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product to cart
                cart.products.push({ productId: objectId, quantity, unit, price, productImage });
            }
        } else {
            // Create a new cart if it doesn't exist
            cart = new Cart({
                email,
                products: [{
                    productId: objectId,
                    quantity,
                    unit,
                    price, 
                    productImage
                }],
            });
        }

        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getCartItems = async (req, res) => {
    try {
        const { email } = req.body; // Get email from the request body

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const cart = await Cart.findOne({ userEmail: email }).populate('products.productId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export { addToCart, getCartItems };