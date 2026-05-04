import Product from '../models/product.model.js';
import mongoose from "mongoose";
import uploadFile from "../services/storage.service.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, page, limit, search } = req.query;

    const query = {};

    // ✅ CATEGORY FILTER
    if (category) {
      query.category = category;
    }

    // ✅ SEARCH FILTER (case-insensitive)
    if (search) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    // 🔥 Populate only active vendors
    const populateVendor = {
      path: "vendor",
      match: { isActive: true },
      select: "name isActive",
    };

    let products = [];
    let total = 0;

    // =========================
    // ✅ WITH PAGINATION
    // =========================
    if (page && limit) {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const skip = (pageNumber - 1) * limitNumber;

      const rawProducts = await Product.find(query)
        .populate(populateVendor)
        .skip(skip)
        .limit(limitNumber);

      // ❗ remove inactive vendor products
      const filteredProducts = rawProducts.filter(p => p.vendor !== null);

      // ⚠️ FIX: total should be from DB, not filtered page length
      const totalProducts = await Product.countDocuments(query);

      return res.status(200).json({
        success: true,
        count: filteredProducts.length,
        page: pageNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
        totalProducts,
        data: filteredProducts,
      });
    }

    // =========================
    // ✅ WITHOUT PAGINATION
    // =========================
    const rawProducts = await Product.find(query).populate(populateVendor);

    const filteredProducts = rawProducts.filter(p => p.vendor !== null);

    total = filteredProducts.length;

    return res.status(200).json({
      success: true,
      count: total,
      totalProducts: total,
      data: filteredProducts,
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    // 🔹 Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id)
      .populate("vendor", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Vendor only)

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const formattedName = name.trim().toLowerCase();

    const existing = await Product.findOne({
      name: formattedName,
      vendor: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: "Product already exists" });
    }

    let imageUrl = "";

    // ✅ CASE 1: file upload
    if (req.file) {
      const uploaded = await uploadFile(req.file);
      imageUrl = uploaded.url;
    }

    // ✅ CASE 2: image URL from input
    else if (image) {
      imageUrl = image;
    }

    const product = await Product.create({
      name: formattedName,
      price,
      category,
      description,
      image: imageUrl,
      stock,
      vendor: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Vendor only)
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure user is the vendor for this product
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Vendor only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure user is the vendor for this product
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this product' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Product removed',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// toggle stock status
export const toggleStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔐 vendor check
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ TOGGLE LOGIC
    product.stock = product.stock > 0 ? 0 : 10;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated",
      data: product,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};