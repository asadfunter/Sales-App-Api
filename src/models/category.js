let categoryCollection;

const CategoryModel = {

    init: async (db) => {
        try {
            console.log('Initializing Category model...');
            categoryCollection = await db.createCollection('categories');
            console.log('✅ Category model initializedd');

        } catch (error) {
            if (error.code == 48) {
                categoryCollection = db.collection('categories');
            } else {
                console.log(error);
                console.log('error in Creating Collection');
            }
        }
    },

    getAll: async(filter) => {

        filter.deleted_at = {$exists: false};

        return await categoryCollection.find(filter).toArray();
    },

    getById: async(id) => {

        let filter = { _id: id};

        return await categoryCollection.findOne(filter);
    },
    deleteById: async(id) => {
        return await categoryCollection.updateOne({ _id: id }, { $set: { deleted_at: new Date() } });
    },
    updateById:async(id, product) => {

        product.updated_at = new Date();
        let result = await categoryCollection.updateOne({ _id: id }, { $set: product });

        if (result.modifiedCount === 0) {
            return null; // No document was updated
        }

        return await categoryCollection.findOne({ _id: id });
    },

    add: async(product) => {

        product.created_at = new Date();
        product.updated_at = null;
        product.slug = product.name.toLowerCase().replace(/ /g, '-');
        let _id = await categoryCollection.insertOne(product);
        
        return await categoryCollection.findOne({ _id: _id.insertedId })
    }

}

module.exports = CategoryModel;