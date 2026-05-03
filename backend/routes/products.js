const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getCategories, getMaxPrice } = require('../controllers/productController');

router.get('/categories', getCategories);
router.get('/max-price', getMaxPrice);
router.get('/', getProducts);
router.get('/:id', getProduct);

module.exports = router;
