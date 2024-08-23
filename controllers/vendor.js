import Vendor from "../models/vendor.js";
import bcrypt from "bcryptjs";
import { sendToken } from "../utils/jwt.js";
import Category from "../models/category.js";
import Product from "../models/product.js";
import ProductCounter from "../models/productCounter.js";

const VendorLogin = async (req, res) => {
  try {
    const { vendorEmail, vendorPassword } = req.body;
    // console.log(vendorEmail);

    let vendor = await Vendor.findOne({ vendorEmail: vendorEmail });
    console.log(vendor);

    if (!vendor) {
      return res
        .status(400)
        .json({ message: "vendor not found, please check email..." });
    }

    const isMatch = await bcrypt.compare(vendorPassword, vendor.vendorPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = sendToken(vendor);

    return res
      .status(200)
      .json({
        message: "vendor logged in successfully...",
        data: vendor,
        token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { category, department } = req.body;
    const newCategory = new Category({ category, department });
    console.log(newCategory);
    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const createProduct = async (req, res) => {
  try {
    const { vendorEmail, productName, category, description, unit, price, department, shopName } = req.body;

    if (!req.files || !req.files.productImage || req.files.productImage.length === 0) {
      return res.status(400).json({ error: "Product image must be uploaded" });
    }

    // Find and update the counter
    const productCounter = await ProductCounter.findOneAndUpdate(
      { name: 'productCode' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    // Generate the new product ID
    const productCode = `PROD${String(productCounter.value).padStart(3, '0')}`;

    const product = new Product({
      productCode, // Use the generated product ID
      vendorEmail,
      department,
      shopName,
      productImage: req.files.productImage[0].location,
      productName,
      category,
      description,
      unit,
      price,
    });

    console.log(product);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export default createProduct;


const editProduct = async (req, res) => {
  try {
    const { id } = req.params; // Assuming productId is passed as a URL parameter
    const { productName, category, description, unit, price } = req.body;

    // Check if there's a new product image uploaded
    let productImage;
    if (req.files && req.files.productImage && req.files.productImage.length > 0) {
      productImage = req.files.productImage[0].location;
    }

    console.log(req.body);

    // Find the product by its ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update only specified product fields
    if (productName) product.productName = productName;  
    if (category) product.category = category;
    if (description) product.description = description;
    if (unit) product.unit = unit;
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

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by its ID and delete it
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("department");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json(products);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const getVendorProducts = async (req, res) => {
  try {
    const vendorProducts = await Product.find({ vendorEmail: req.body.vendorEmail });
    if (!vendorProducts) {
      return res.status(400).json({ message: "vendor not found" });
    }

    return res.status(200).json({ data: vendorProducts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error...", error });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export {
  VendorLogin,
  getAllVendors,
  createCategory,
  createProduct,
  getAllCategories,
  getAllProducts,
  getVendorProducts,
  editProduct,
  deleteProduct,
  getSingleProduct
};
