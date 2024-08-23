import Order from "../models/order.js";
import Vendor from "../models/vendor.js";

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

export const getAllOrders = async (req, res) => {
    try {
        // Find all orders
        const orders = await Order.find();

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// API to get orders based on user's email
export const getUserOrders = async (req, res) => {
    const { email } = req.body;

    try {
        // Find orders associated with the user's email
        const orders = await Order.find({ email });

        if (!orders) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getOrderProductsByVendorEmail = async (req, res) => {
    const { vendorEmail } = req.params;
    

    try {
        // Find all orders
        const orders = await Order.find({ 'products.vendorEmail': vendorEmail });
        

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this vendor' });
        }

        // Extract the products associated with the given vendorEmail
        const products = orders.flatMap(order => 
            order.products.filter(product => product.vendorEmail === vendorEmail)
        );
        // console.log(products)

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};