import Admin from '../models/admin.js';
import Vendor from '../models/vendor.js';
import PayHistory from '../models/payHistory.js';
import SoldProduct from '../models/soldProduct.js';
import bcrypt from 'bcryptjs';
import Department from "../models/department.js";
import Category from "../models/category.js";
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import OfferProduct from '../models/offerProducts.js';
import Setting from '../models/setting.js';


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

    if (!req.files || !req.files.departmentImage || !req.files.coverImage) {
      return res.status(400).json({ error: "Both department image and cover image must be uploaded" });
    }

    const newDepartment = new Department({
      department,
      departmentImage: req.files.departmentImage[0].location, 
      coverImage: req.files.coverImage[0].location,           
    });

    await newDepartment.save();
    return res.status(201).json({ message: "Department created successfully..." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const editDepartment = async (req, res) => {
  try {
    const { id } = req.params; 

    // Initialize variables to hold the new images if provided
    let departmentImage;
    let coverImage;

    // Check if departmentImage is present in the request
    if (req.files && req.files.departmentImage && req.files.departmentImage.length > 0) {
      departmentImage = req.files.departmentImage[0].location;
    }

    // Check if coverImage is present in the request
    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
      coverImage = req.files.coverImage[0].location;
    }

    // Find the department by ID
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    // Only update departmentImage if a new one is provided
    if (departmentImage) {
      department.departmentImage = departmentImage;
    }

    // Only update coverImage if a new one is provided 
    if (coverImage) {
      department.coverImage = coverImage;
    }

    // Save the updated department
    await department.save();

    res.status(200).json({ message: "Department updated successfully", department });
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

export const offerProduct = async (req, res) => {
  try {
    const { 
      productCode,
      vendorEmail, 
      vendorCommission, 
      productName, 
      category, 
      description,  
      unit, 
      actualPrice, 
      price, 
      balance, 
      department, 
      shopName,
      productImage // Assume this might come as a string if no file is uploaded
    } = req.body;

    // Check if the product with the same productCode already exists
    const existingProduct = await OfferProduct.findOne({ productCode });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with this product code already exists." });
    }

    // Check if the product image was uploaded via form-data
    let uploadedProductImage;
    if (req.files && req.files.productImage && req.files.productImage.length > 0) {
      uploadedProductImage = req.files.productImage[0].location; // Using the uploaded image URL
    } else if (productImage) {
      // Use the existing productImage from the request body (if passed)
      uploadedProductImage = productImage;
    } else {
      return res.status(400).json({ error: "Product image must be uploaded or provided." });
    }

    // Create the new offer product with all fields, including the image
    const offerProduct = new OfferProduct({
      productCode, 
      vendorEmail,
      vendorCommission,
      department,
      shopName,
      productImage: uploadedProductImage, // Use either uploaded or provided image
      productName,
      category,
      description,
      unit,
      actualPrice,
      price,
      balance
    });

    // Save the new offer product to the database
    await offerProduct.save();
    res.status(201).json(offerProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};


export const getAllOfferProducts = async (req, res) => {
  try {
    const products = await OfferProduct.find()
    res.status(200).json(products);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const editOfferProduct = async (req, res) => {
  try {
    const { id } = req.params; // Assuming productId is passed as a URL parameter
    const { productName, category, description, unit, actualPrice, price } = req.body;

    // Check if there's a new product image uploaded
    let productImage;
    if (req.files && req.files.productImage && req.files.productImage.length > 0) {
      productImage = req.files.productImage[0].location;
    }

    // console.log(req.body);

    // Find the product by its ID
    const product = await OfferProduct.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update only specified product fields
    if (productName) product.productName = productName;  
    if (category) product.category = category;
    if (description) product.description = description;
    if (unit) product.unit = unit;
    if (actualPrice) product.actualPrice = actualPrice;
    if (price) product.price = price;
    if (productImage) product.productImage = productImage;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteOfferProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by its ID and delete it
    const product = await OfferProduct.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


// Create a new setting
export const createSetting = async (req, res) => {
  try {
    // Access offerImage path
    const offerImage = req.files.offerImage && req.files.offerImage.length > 0 
      ? req.files.offerImage[0].location 
      : null; // Get the S3 URL

    // Access heroImages paths
    const heroImages = req.files.heroImages 
      ? req.files.heroImages.map(file => file.location) 
      : []; // Get S3 URLs

    // console.log('Offer Image:', offerImage); 
    // console.log('Hero Images:', heroImages); 

    // Create a new setting with the images
    const newSetting = new Setting({
      offerImage,
      heroImages, // Array of hero image paths
    });

    const savedSetting = await newSetting.save();
    res.status(201).json({
      success: true,
      message: 'Setting created successfully',
      data: savedSetting,
    });
  } catch (error) {
    console.error('Error:', error); // Log error for better debugging
    res.status(500).json({
      success: false,
      message: 'Error creating setting',
      error: error.message, // Provide error message for clarity
    });
  }
};

// Get all settings
export const getSettings = async (req, res) => {
  try {
      const settings = await Setting.find();
      res.status(200).json({ success: true, data: settings });
  } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching settings", error });
  }
};

// Update a setting by ID
export const updateSetting = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {}; // Initialize an object to hold update fields
    let offerImage;
    let heroImages = []; // Initialize as an array

    // Check if offerImage file exists and assign its location
    if (req.files && req.files.offerImage && req.files.offerImage.length > 0) {
      offerImage = req.files.offerImage[0].location;
      updateData.offerImage = offerImage; // Add to update object
    }

    // Check if heroImages files exist and map to get their locations
    if (req.files && req.files.heroImages && req.files.heroImages.length > 0) {
      heroImages = req.files.heroImages.map(file => file.location); // Collect all image locations
      updateData.heroImages = heroImages; // Add to update object
    }

    // Extract offerHeading and heroHeading from request body
    if (req.body.offerHeading) {
      updateData.offerHeading = req.body.offerHeading; // Add to update object
    }

    if (req.body.heroHeading) {
      updateData.heroHeading = req.body.heroHeading; // Add to update object
    }

    // Update only if there's something to update
    const updatedSetting = await Setting.findByIdAndUpdate(
      id,
      updateData, // Use the update object
      { new: true }  // Return the updated document
    );

    if (!updatedSetting) {
      return res.status(404).json({ success: false, message: "Setting not found" });
    }

    res.status(200).json({ success: true, message: "Setting updated successfully", data: updatedSetting });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating setting", error });
  }
};








