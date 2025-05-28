const InventoryModel = require("./inventory");
const SaleModel = require("./sales");

let inventoryHistoryCollection;

const InventoryHistoryModel = {

    init: async (db) => {
        try {
            console.log('Initializing Inventory History model...');
            inventoryHistoryCollection = await db.createCollection('inventory_history');
            console.log('✅ Inventory History model initializedd');

        } catch (error) {
            if (error.code == 48) {
                inventoryHistoryCollection = db.collection('inventory_history');
            } else {
                console.log(error);
                console.log('error in Creating Collection');
            }
        }

        if(inventoryHistoryCollection && !await inventoryHistoryCollection.findOne()){
            await InventoryHistoryModel.seedData();
        }
    },

    getAll: async(filter) => {

        filter.deleted_at = {$exists: false};

        return await inventoryHistoryCollection.find(filter).toArray();
    },

    getById: async(id) => {

        let filter = { _id: id, deleted_at: { $exists: false } };

        return await inventoryHistoryCollection.findOne(filter);
    },
    deleteById: async(id) => {
        return await inventoryHistoryCollection.updateOne({ _id: id }, { $set: { deleted_at: new Date() } });
    },
    updateById:async(id, product) => {

        product.updated_at = new Date();
        let result = await inventoryHistoryCollection.updateOne({ _id: id }, { $set: product });

        if (result.modifiedCount === 0) {
            return null; // No document was updated
        }

        return await inventoryHistoryCollection.findOne({ _id: id });
    },

    add: async(product) => {

        product.created_at = new Date();
        product.updated_at = null;
        product.slug = product.name.toLowerCase().replace(/ /g, '-');
        let _id = await inventoryHistoryCollection.insertOne(product);
        
        return await inventoryHistoryCollection.findOne({ _id: _id.insertedId })
    },

    seedData: async()=>{

        let sales = await SaleModel.getAll({},1,100,false);

        let inventories = await InventoryModel.getAll({})

        let histories = []

        let inventory_history = sales.map((sale)=>{

            let productInventoryIndex = inventories.findIndex((inventory) => inventory.product_id == sale.product_id);

            if(productInventoryIndex < 0) return

            inventories[productInventoryIndex]['stock'] -=  sale.units_sold;

            let historyIndex = histories.findIndex(history => history.date == sale.date && history.product_id == sale.product_id);

            if(historyIndex < 0){
                histories.push({
                    product_id:sale.product_id,
                    date: sale.date,
                    units_sold : sale.units_sold,
                    units_left : inventories[productInventoryIndex]['stock']
                })
            }
            else{
                histories[historyIndex]['units_sold'] += sale.units_sold
                histories[historyIndex]['units_left'] -= sale.units_sold
            }

        })

        await inventoryHistoryCollection.insertMany(histories);
        
    }

}

module.exports = InventoryHistoryModel;