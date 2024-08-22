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

const removeCartItem = async (req, res) => {
    const { email, productId } = req.body;
  
    try {
      // Find the cart associated with the user email
      let cart = await Cart.findOne({ email });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Remove the product from the cart
      cart.products = cart.products.filter(
        (product) => product.productId.toString() !== productId
      );
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Product removed from cart successfully', cart });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const clearCart = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Find the cart associated with the user's email
      let cart = await Cart.findOne({ email });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Clear the cart by setting products to an empty array
      cart.products = [];
      await cart.save();
  
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

export { addToCart, getCartItems, removeCartItem, clearCart };