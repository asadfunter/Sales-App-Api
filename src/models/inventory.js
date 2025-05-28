const fs = require("fs");
const ProductModel = require("./products");
const Utils = require("../../utils/utils");

let inventoryCollection;

const InventoryModel = {

    init: async (db) => {
        try {
            console.log('Initializing Inventory model...');
            inventoryCollection = await db.createCollection('inventory');
            console.log('✅ Inventory model initializedd');

        } catch (error) {
            if (error.code == 48) {
                inventoryCollection = db.collection('inventory');
            } else {
                console.log(error);
                console.log('error in Creating Collection');
            }
        }

        if(inventoryCollection && !await inventoryCollection.findOne()){
            InventoryModel.seedData()
        }
    },

    getAll: async(params, currentPage, perPage, paginate) => {

        let filter = {}
        
        filter.deleted_at = {$exists: false};

        if(params.lowStock && params.lowStock == "true"){

            filter.stock = {$lte : 500}

        }

         if (!paginate) {
            return await inventoryCollection.find(filter).toArray()
        }

        let pagination = Utils.CalcPagination(currentPage, perPage)
        const total = await inventoryCollection.countDocuments(filter)
        let data = await inventoryCollection.find(filter).skip(pagination.skip).limit(pagination.limit).toArray()/*.skip(pagination.skip).limit(pagination.limit).toArray();*/

        return paginate ? Utils.Pagination(data, currentPage, perPage, parseInt(total)) : data
    },

    getById: async(id) => {

        let filter = { _id: id, deleted_at: { $exists: false } };

        return await inventoryCollection.findOne(filter);
    },

    deleteById: async(id) => {
        return await inventoryCollection.updateOne({ _id: id }, { $set: { deleted_at: new Date() } });
    },
    
    updateById:async(id, product) => {

        product.updated_at = new Date();
        let result = await inventoryCollection.updateOne({ _id: id }, { $set: product });

        if (result.modifiedCount === 0) {
            return null; // No document was updated
        }

        return await inventoryCollection.findOne({ _id: id });
    },

    addStock:async(id, quantity) => {

        let result = await inventoryCollection.updateOne({ product_id: id }, { $inc: {stock:quantity} });

        if (result.modifiedCount === 0) {
            return null; // No document was updated
        }

        return await inventoryCollection.findOne({ product_id: id });
    },

    add: async(product) => {

        product.created_at = new Date();
        product.updated_at = null;
        product.slug = product.name.toLowerCase().replace(/ /g, '-');
        let _id = await inventoryCollection.insertOne(product);
        
        return await inventoryCollection.findOne({ _id: _id.insertedId })
    },

    seedData: async()=>{

        const inventories = fs.readFileSync("jsons/inventory.json", "utf8");
        const inventory_json = JSON.parse(inventories);

        let products = await ProductModel.getAll({});

        inventory_json.forEach(inventory => {

            let product = products.find(p => p._id.toString() == inventory.product_id)

            if(product){

                inventory.product = product

            }

        });

        await inventoryCollection.insertMany(inventory_json)

    }

}

module.exports = InventoryModel;