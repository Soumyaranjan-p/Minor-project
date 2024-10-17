import { Product } from "../models/Product.js";
import { rm } from "fs";

export const createProduct = async (req, res) => {
  
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "Unauthorized", // condition for checking user role
      });

    const { title, description, category, price, stock } = req.body;

    const image = req.file;

    if (!image)
      return res.status(400).json({
        message: "Please give image",
      });

    const product = await Product.create({
      title,
      description,
      category,
      price,
      stock,
      image: image?.path,
    });

    res.status(201).json({
      message: "Product Created",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const { search, category, price, page } = req.query; 

    const filter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (price) {
      filter.price = {
        $gte: Number(price),
      };
    }

    if (category) filter.category = category;

    const countProduct = await Product.countDocuments(); 

    const limit = 4; 

    const skip = (page - 1) * limit;

    const totalPages = Math.ceil(countProduct / limit);

    const products = await Product.find(filter)
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);

    const categories = await Product.distinct("category"); categories

    const mostSelling = await Product.find().sort({ sold: -1 }).limit(3); 

    res.json({ products, totalPages, categories, mostSelling });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const fetchProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find();

    res.json({ products });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const fetchSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json({ product });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStock = async (req, res) => {
  try {
   
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "Unauthorized", 
      });
    const product = await Product.findById(req.params.id);

    if (req.body.stock) {
      product.stock = req.body.stock;
      await product.save();
      return res.json({
        message: "Stock Updated",
      });
    }

    res.status(400).json({
      message: "Please give stock value",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    //this route is for admin
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "Unauthorized", // condition for checking user role
      });
    const product = await Product.findById(req.params.id);

    rm(product.image, () => {
      console.log("Image deleted"); //this is to delete product image from uploads folder
    });

    await product.deleteOne();

    res.json({
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
