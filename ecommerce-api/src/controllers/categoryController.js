const Category = require("../models/category");

const errorHandler = require("../middlewares/errorHandler");

/**
 * @swagger
 * /categories:
 *    get:
 *      summary: Get all categories
 *      tags: [Categories]
 *      parameters:
 *        - in: query
 *        name: page
 *        description: Page number
 *        required: false
 *        schema:
 *          type: integer
 *          default: 1
 *      - in: query
 *        name: limit
 *        description: Number of categories per page
 *        required: false
 *        schema:
 *          type: integer
 *          default: 10
 *    responses:
 *      200:
 *        description: List of categories
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                total:
 *                type: integer
 *                page:
 *                type: integer
 *                limit:
 *                type: integer
 *                categories:
 *                type: array
 *              items:
 *                $ref: '#/components/schemas/Category'
 *      404:
 *        description: No categories found
 *        content:
 *          application/json:
 *        schema:
 *        type: object
 *        properties:
 *        message:
 *        type: string
 *        example: No categories found
 *    500:
 *      description: Some server error
 *      content:
 *      application/json:
 *      schema:
 *      type: object
 *        properties:
 *        message:
 *        type: string
 *        example: Internal Server Error
 *
 */

exports.getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCategories = await Category.countDocuments();

    res.status(200).json({
      total: totalCategories,
      page: parseInt(page),
      limit: parseInt(limit),
      categories,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, imageUrl } = req.body;

    const newCategory = new Category({
      name,
      description,
      parentCategory,
      imageUrl,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, imageUrl } = req.body;

    const updatedCategory = {
      name,
      description,
      parentCategory,
      imageUrl,
    };

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updatedCategory,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(204).send();
  } catch (error) {
    errorHandler(error, req, res);
  }
};
