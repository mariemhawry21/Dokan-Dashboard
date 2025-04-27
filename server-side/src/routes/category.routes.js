
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);


const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  softDeleteCategory,
} = require('../controllers/category.controller');
const upload = require('../middlewares/upload.middleware'); // waitttinnnnnnnnnnnnnnnnng
const router = express.Router();

// GET all, CREATE
router.route('/')
  .get(getAllCategories)
  .post(
    (req, res, next) => {
      req.folderName = 'categories';
      next();
    },
    upload.single('image'),
    createCategory
  );

// GET one, UPDATE, DELETE
router.route('/:id')
.get(getCategoryById)
.put(
  (req, res, next) => {
    req.folderName = 'categories';
    next();
  },
  upload.single('image'),
  updateCategory
)
.delete(softDeleteCategory);

module.exports = router;
