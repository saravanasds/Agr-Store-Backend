import Order from "../models/order.js";
import SoldProduct from "../models/soldProduct.js";
import Vendor from "../models/vendor.js";
import User from "../models/user.js";


export const placeOrder = async (req, res) => {
    try {
        const {
            name, email, address, pincode, totalAmount, discount, mobileNumber,
            razorpayPaymentId, razorpayOrderId, razorpaySignature,
            paymentMethod, totalCommission, products 
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !email ||
            !address ||
            !pincode ||
            !totalAmount ||
            // !discount ||
            !mobileNumber ||
            !paymentMethod ||
            !totalCommission ||
            !products
        ) {
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
            discount,
            razorpayPaymentId: paymentMethod === 'COD' ? undefined : razorpayPaymentId,
            paymentMethod,
            totalCommission,
            products,
            orderStatus: 'Processing', // Default status
            createdAt: new Date()
        });

        await newOrder.save();

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Subtract the discount from the user's userShare
        const updatedUserShare = user.userShare - discount;

        // Update the user's userShare in the database
        await User.updateOne(
            { email },
            { $set: { userShare: updatedUserShare } }
        );

        return res.status(201).json({ message: 'Order placed successfully', order: newOrder, updatedUserShare });
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

        // Handle 'Completed' status
        if (orderStatus === 'Completed') {
            const soldProducts = updatedOrder.products.map(product => ({
                productId: product.productId,
                productCode: product.productCode,
                shopName: product.shopName,
                vendorEmail: product.vendorEmail,
                productName: product.productName,
                total: product.total,
                commissionAmount: product.commissionAmount,
                balance: product.balance,
                quantity: product.quantity,
            }));

            await SoldProduct.insertMany(soldProducts);

            for (const product of soldProducts) {
                await Vendor.findOneAndUpdate(
                    { vendorEmail: product.vendorEmail },
                    {
                        $inc: {
                            vendorBalance: product.balance,
                            totalSaleAmount: product.total,
                            commissionAmount: product.commissionAmount
                        }
                    },
                    { new: true }
                );
            }

            const totalCommission = soldProducts.reduce((sum, product) => sum + product.commissionAmount, 0);
            const userCount = await User.countDocuments();
            const userShare = (totalCommission * 0.2) / userCount;

            await User.updateMany({}, { $inc: { userShare } });
        }

        // Handle 'Canceled' status
        if (orderStatus === 'Canceled') {
            // Retrieve the user based on email
            const user = await User.findOne({ email: order.email });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Add the discount back to the user's userShare
            const updatedUserShare = user.userShare + order.discount;

            // Update user's userShare in the database
            await User.updateOne(
                { email: order.email },
                { $set: { userShare: updatedUserShare } }
            );
        }

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status', error });
    }
};




export const getAllSoldProducts = async (req, res) => {
    try {
        // Find all soldProducts
        const soldProducts = await SoldProduct.find();

        if (soldProducts.length === 0) {
            return res.status(404).json({ message: 'No Sold Products found' });
        }
        res.status(200).json({ soldProducts });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
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







