import Admin from '../models/admin.js';
import Vendor from '../models/vendor.js';
import PayHistory from '../models/payHistory.js';
import SoldProduct from '../models/soldProduct.js';
import bcrypt from 'bcryptjs';
import Department from "../models/department.js";
import Category from "../models/category.js";
import jwt from 'jsonwebtoken';
import User from '../models/user.js';


export const registerAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if the email is already registered
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({ name, email, password: hashedPassword, role });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, data: admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    if (!req.files || !req.files.departmentImage || req.files.departmentImage.length === 0) {
      return res.status(400).json({ error: "Department image must be uploaded" });
    }

    const newDepartment = new Department({
      department,
      departmentImage: req.files.departmentImage[0].location,
    });

    await newDepartment.save();
    return res.status(201).json({ message: "Department created successfully..." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};


// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { category, department } = req.body;

    if (!req.files || !req.files.categoryImage || req.files.categoryImage.length === 0) {
      return res.status(400).json({ error: "Category image must be uploaded" });
    }

    const newCategory = new Category({
      category,
      department,
      categoryImage: req.files.categoryImage[0].location,
    });

    // console.log(newCategory);
    await newCategory.save();
    return res.status(201).json({ message: "Department created successfully..." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNewVendor = async (req, res) => {
  const {
    department,
    shopName,
    vendorName,
    vendorEmail,
    vendorMobileNumber,
    vendorAlternateMobileNumber,
    vendorGpayNo,
    vendorBankAcNo,
    vendorBankName,
    vendorBranch,
    vendorIfsc,
    vendorCommision,
    shopAddress,
    vendorPassword,
  } = req.body;


  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(vendorEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if the email is already registered
    const existingVendor = await Vendor.findOne({ vendorEmail });
    if (existingVendor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(vendorPassword, 12);

    const newVendor = new Vendor({
      department,
      shopName,
      vendorName,
      vendorEmail,
      vendorMobileNumber,
      vendorAlternateMobileNumber,
      vendorGpayNo,
      vendorBankAcNo,
      vendorBankName,
      vendorBranch,
      vendorIfsc,
      vendorCommision,
      shopAddress,
      vendorPassword: hashedPassword,
    });
    await newVendor.save();

    res.status(201).json({ message: 'Vendor registered successfully' });
  } catch (error) {
    console.error(error); // Add this line for logging
    res.status(500).json({ message: 'Server error' });
  }
};

export const payHistory = async (req, res) => {
  try {
    const { vendorEmail, shopName, paymentAmount, transactionId } = req.body;

    const newPayHistory = new PayHistory({
      vendorEmail,
      shopName,
      paymentAmount,
      transactionId,
    });

    await newPayHistory.save();

    const vendor = await Vendor.findOne({ vendorEmail: vendorEmail });
    if (vendor) {
      vendor.totalSaleAmount = 0;
      vendor.vendorBalance = 0;
      vendor.commissionAmount = 0;
      await vendor.save();
    }

    res.status(201).json({ message: "Payment history added and vendor balances reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getAllPayHistories = async (req, res) => {
  try {
    const payHistories = await PayHistory.find();
    res.status(200).json(payHistories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayHistoriesByVendorEmail = async (req, res) => {
  try {
    const vendorEmail = req.params.vendorEmail;
  
    const payHistories = await PayHistory.find({ vendorEmail: vendorEmail });

    if (!payHistories) {
      return res.status(404).json({ message: "Payment History not found" });
    }

    res.status(200).json(payHistories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const getVendorCommissions = async (req, res) => {
  try {
    // Group by vendorEmail and sum the commissionAmount for each vendor
    const vendorCommissions = await SoldProduct.aggregate([
      {
        $group: {
          _id: {
            vendorEmail: '$vendorEmail',
            shopName: '$shopName',
          }, // Group by vendorEmail and shopName
          totalCommission: { $sum: '$commissionAmount' }, // Sum the commissionAmount for each vendor and shop
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the result
          vendorEmail: '$_id.vendorEmail',
          shopName: '$_id.shopName',
          totalCommission: 1, // Include totalCommission in the result
        },
      },
    ]);

    // Calculate the total commission sum across all vendors
    const totalCommission = await SoldProduct.aggregate([
      {
        $group: {
          _id: null,
          totalCommission: { $sum: '$commissionAmount' },
        },
      },
    ]);

    res.status(200).json({
      vendorCommissions,
      totalCommission: totalCommission[0]?.totalCommission || 0, // Total commission sum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const distributeUserShare = async (req, res) => {
  try {
    const { totalUserShare } = req.body; // The total user share to be distributed

    // Fetch all users
    const users = await User.find();

    if (users.length === 0) {
      return res.status(400).json({ message: 'No users found' });
    }

    // Calculate individual user share
    const individualShare = totalUserShare / users.length;

    // Update each user's share in the database
    const userUpdatePromises = users.map(user => {
      user.userShare = individualShare.toFixed(2);
      return user.save();
    });

    await Promise.all(userUpdatePromises);

    res.status(200).json({ message: 'User share distributed successfully' });
  } catch (error) {
    console.error('Error distributing user share:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





