require('dotenv').config();
const express = require('express');
const { connectDB } = require('./configs/db');
const ProductModel = require('./src/models/products');
const app = express();
app.use(express.json());
const routes = require('./src/routes/routes');
const InventoryModel = require('./src/models/inventory');
const SaleModel = require('./src/models/sales');
const CategoryModel = require('./src/models/category');
const InventoryHistoryModel = require('./src/models/inventoryHistory');


async function startServer() {
  
  const db = await connectDB();

  // Initialize Dbs
  await CategoryModel.init(db);
  await ProductModel.init(db);
  await InventoryModel.init(db);
  await SaleModel.init(db);
  await InventoryHistoryModel.init(db);

  // Initialize Routes
  app.use('/api/', routes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startServer();
