import Order from "../models/order.js";


export const placeOrder = async (req, res) => {
    try {
        const {
            name, email, address, pincode, totalAmount, mobileNumber,
            razorpayPaymentId, razorpayOrderId, razorpaySignature,
            paymentMethod, products
        } = req.body;

        // console.log("order details", req.body);

        // Validate required fields
        if (!name || !email || !address || !pincode || !totalAmount || !mobileNumber || !paymentMethod || !products) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Handle COD specific logic
        if (paymentMethod === 'COD') {
            // Ensure no online payment details are provided for COD
            if (razorpayPaymentId || razorpayOrderId || razorpaySignature) {
                return res.status(400).json({ message: 'Payment details should be omitted for COD orders' });
            }
        } else {
            // Validate Razorpay payment details for online payments
            if (!razorpayPaymentId) {
                return res.status(400).json({ message: 'Missing payment details for online payment' });
            }
        }

        // Create and save the order
        const newOrder = new Order({
            name,
            email,
            address,
            mobileNumber,
            pincode,
            totalAmount,
            razorpayPaymentId: paymentMethod === 'COD' ? undefined : razorpayPaymentId,

            paymentMethod,
            products,
            orderStatus: 'Processing', // Default status or based on your logic
            createdAt: new Date()
        });

        await newOrder.save();

        return res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order', error: error.message });
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

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    try {
        // Update the order status
        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status inside each product
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                $set: {
                    "products.$[elem].orderStatus": orderStatus,
                },
            },
            {
                arrayFilters: [{ "elem.productId": { $exists: true } }],
                new: true,
            }
        );

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating order status', error });
    }
};



export const getVendorBalanceSums = async (req, res) => {
    try {
        const balanceSums = await Order.aggregate([
            { $unwind: "$products" }, // Unwind the products array
            { $match: { "products.orderStatus": "Completed" } }, // Match only completed orders
            {
                $group: {
                    _id: {
                        vendorEmail: "$products.vendorEmail",
                        shopName: "$products.shopName"
                    },
                    totalBalance: {
                        $sum: { $toDouble: "$products.balance" } // Convert balance to double before summing
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    vendorEmail: "$_id.vendorEmail",
                    shopName: "$_id.shopName",
                    totalBalance: 1
                }
            },
            { $match: { totalBalance: { $gt: 0 } } } // Filter out groups with totalBalance of 0
        ]);

        res.status(200).json(balanceSums);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching balance sums', error });
    }
};







