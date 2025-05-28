const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const SalesController = require('../controllers/salesController');
const InventoryController = require('../controllers/inventoryController');

router.get('/product', ProductController.getProducts);
router.post('/product', ProductController.createProduct);
router.get('/product/:id', ProductController.getProductById);
router.delete('/product/:id', ProductController.deleteProductById);
router.put('/product/:id', ProductController.updateProductById);



router.get("/sales",SalesController.getSales);
router.get("/sales-revenue",SalesController.getSalesRevenue);
router.get("/sales-revenue-by-period",SalesController.compareSalesRevenueByPeriod);
router.get("/sales-revenue-by-category",SalesController.compareSalesRevenueByCategories);

router.get("/inventory",InventoryController.getAll);
router.put("/inventory/add-stock/:id",InventoryController.addStock);




module.exports = router;
