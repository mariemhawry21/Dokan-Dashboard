const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
// const cloudinary = require('../config/cloudinary.config');
const upload = require('../middlewares/upload.middleware');
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

router.route('/')
  .get(productController.getAllProducts)
  .post(
    (req, res, next) => {
      req.folderName = 'products';
      next();
    },
    upload.single('image'),
    productController.createProduct
  );
router.route('/search').get(productController.getSearchProducts);
router.route('/min-price').get(productController.getMinEffectivePrice);
router.route('/max-price').get(productController.getMaxEffectivePrice);
router
  .route('/comparison/:product_id')
  .get(productController.getProductForComparison);
  router.route('/:product_id')
  .get(productController.getProductById)
  .put(
    (req, res, next) => {
      req.folderName = 'products';
      next();
    },
    upload.single('image'),
    productController.updateProduct
  )
  .delete(productController.softDeleteProduct);
router.route('/:product_id/colors').put(productController.updateProductColors);
router.route('/:product_id/stock').get(productController.getProductStock);

module.exports = router;
