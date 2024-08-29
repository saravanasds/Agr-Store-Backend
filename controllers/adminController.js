import Admin from '../models/admin.js';
import Vendor from '../models/vendor.js';
import bcrypt from 'bcryptjs';
import Department from "../models/department.js";
import Category from "../models/category.js";
import jwt from 'jsonwebtoken';


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
    res.status(200).json({ token, data:admin });
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