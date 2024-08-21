import Order from "../models/order.js";

export const placeOrder = async (req, res) => {
    try {
        const orderData = req.body;

        // Create and save the order
        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
};