const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetOrders, adminUpdateOrderStatus,
  adminGetCategories, adminCreateCategory,
  adminUploadImage, adminUploadMultipleImages,
  adminGetReport,
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.post('/upload', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, adminUploadImage);

router.post('/upload-multiple', (req, res, next) => {
  upload.array('images', 3)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, adminUploadMultipleImages);

router.get('/products', adminGetProducts);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

router.get('/orders', adminGetOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

router.get('/categories', adminGetCategories);
router.post('/categories', adminCreateCategory);

router.get('/report', adminGetReport);

module.exports = router;
