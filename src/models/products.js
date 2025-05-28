const { ObjectId } = require("mongodb");
const fs = require("fs");

let productsCollection;

const ProductModel = {

    init: async (db) => {
        try {
            console.log('Initializing Products model...');
            productsCollection = await db.createCollection('products');
            console.log('✅ Products model initializedd');

        } catch (error) {
            if (error.code == 48) {
                productsCollection = db.collection('products');
            } else {
                console.log(error);
                console.log('error in Creating Collection');
            }
        }
        if (productsCollection && !await productsCollection.findOne()) {
            ProductModel.seedData()
        }
    },

    getAll: async (filter) => {

        filter.deleted_at = { $exists: false };

        return await productsCollection.find(filter).toArray();
    },

    getByFilter: async (filter) => {

        filter.deleted_at = { $exists: false }

        return await productsCollection.findOne(filter);
    },

    deleteById: async (id) => {
        return await productsCollection.updateOne({ _id: id }, { $set: { deleted_at: new Date() } });
    },
    updateById: async (id, product) => {

        product.updated_at = new Date();
        let result = await productsCollection.updateOne({ _id: id }, { $set: product });

        if (result.modifiedCount === 0) {
            return null; // No document was updated
        }

        return await productsCollection.findOne({ _id: id });
    },

    add: async (product) => {

        product.created_at = new Date();
        product.updated_at = null;
        product.slug = product.product_name.toLowerCase().replace(/ /g, '-');
        let _id = await productsCollection.insertOne(product);

        return await productsCollection.findOne({ _id: _id.insertedId })
    },

    seedData: async () => {

        const products = fs.readFileSync("jsons/products.json", "utf8");
        const products_json = JSON.parse(products);

        products_json.forEach(product => {


            product._id = new ObjectId(product._id.$oid)


        });

        await productsCollection.insertMany(products_json)

    }

}

module.exports = ProductModel;