const Utils = require("../../utils/utils");
const CategoryModel = require("./category");
const fs = require("fs");

let salesCollection;

const SaleModel = {

    init: async (db) => {
        try {
            console.log('Initializing Sales model...');
            salesCollection = await db.createCollection('sales');
            console.log('✅ Sales model initializedd');

        } catch (error) {
            if (error.code == 48) {
                salesCollection = db.collection('sales');
            } else {
                console.log(error);
                console.log('error in Creating Collection');
            }
        }

         if(salesCollection && !await salesCollection.findOne()){
            SaleModel.seedData()
        }
    },

    getAll: async (params, currentPage, perPage, paginate) => {

        let filter = {}

        filter.deleted_at = { $exists: false };

        if (params.startDate && params.startDate != "") {
            filter.date = { $gte: params.startDate };
        }

        if (params.endDate && params.endDate != "") {
            filter.date = { $lte: params.endDate };
        }

        if (params.startDate && params.startDate != "" && params.endDate && params.endDate != "") {
            filter.date = { $gte: params.startDate, $lte: params.endDate };
        }

        if (params.productId && params.productId != "") {
            filter.product_id = params.productId
        }

        if (params.categoryId && params.categoryId != "") {
            filter.category_id = +params.categoryId
        }

        if (!paginate) {
            return await salesCollection.find(filter).toArray()
        }

        let pagination = Utils.CalcPagination(currentPage, perPage)
        const total = await salesCollection.countDocuments(filter)
        let data = await salesCollection.find(filter).skip(pagination.skip).limit(pagination.limit).toArray()/*.skip(pagination.skip).limit(pagination.limit).toArray();*/

        return paginate ? Utils.Pagination(data, currentPage, perPage, parseInt(total)) : data
    },

    compareSalesRevenueByPeriod: async (params) => {

        const { periodOneStartDate, periodOneEndDate, periodTwoStartDate, periodTwoEndDate } = params;

        const p1Start = new Date(periodOneStartDate);
        const p1End = new Date(periodOneEndDate);
        const p2Start = new Date(periodTwoStartDate);
        const p2End = new Date(periodTwoEndDate);

        const period1Match = {
            date: { $gte: p1Start, $lte: p1End }
        };

        const period2Match = {
            date: { $gte: p2Start, $lte: p2End }
        };

        const periodOneStats = await SaleModel.getSalesAggregateByFilter(period1Match)
        const periodTwoStats = await SaleModel.getSalesAggregateByFilter(period2Match)

        return {
            period1 : { startDate : periodOneStartDate, endDate:periodOneEndDate, ...periodOneStats},
            period2 : { startDate : periodTwoStartDate, endDate:periodTwoEndDate, ...periodTwoStats}
        }

    },

    compareSalesRevenueByCategories: async (params) => {

        const { categoryOneId, categoryTwoId} = params;

        const period1Match = {
            category_id: +categoryOneId
        };

        const period2Match = {
            category_id: +categoryTwoId
        };
        
        const [categoryOne,categoryTwo] = await Promise.all([
            CategoryModel.getById(+categoryOneId),
            CategoryModel.getById(+categoryTwoId)
        ])

        const periodOneStats = await SaleModel.getSalesAggregateByFilter(period1Match)
        const periodTwoStats = await SaleModel.getSalesAggregateByFilter(period2Match)

        return {
            period1 : { category : categoryOne?categoryOne.category_name : null, ...periodOneStats},
            period2 : { category : categoryTwo?categoryTwo.category_name: null, ...periodTwoStats}
        }

    },

    getSalesAggregateByFilter: async (filter) => {

        let result = await salesCollection.aggregate([
            { $addFields: { date: { $toDate: "$date" } } },
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$revenue" },
                    totalUnitsSold: { $sum: "$units_sold" }
                }
            }
        ]).toArray();

        return result[0] || { totalRevenue: 0, totalUnitsSold: 0, averagePrice: 0 }

    },

    getRevenue: async (period) => {

        let groupByFormat;
        switch (period) {
            case 'daily':
                groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
                break;
            case 'weekly':
                groupByFormat = { $isoWeek: "$date" };
                break;
            case 'monthly':
                groupByFormat = { $dateToString: { format: "%Y-%m", date: "$date" } };
                break;
            case 'yearly':
                groupByFormat = { $dateToString: { format: "%Y", date: "$date" } };
                break;
            default:
                throw new Error("Invalid Period Provided")
        }

        const results = await salesCollection.aggregate([
            {
                $addFields: {
                    date: {
                        $toDate: "$date" // Ensure the field is treated as a Date
                    }
                }
            },
            {
                $group: {
                    _id: groupByFormat,
                    totalRevenue: { $sum: "$revenue" },
                    totalUnitsSold: { $sum: "$units_sold" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        return results.toArray()



    },

    getById: async (id) => {

        let filter = { _id: id, deleted_at: { $exists: false } };

        return await salesCollection.findOne(filter);
    },
    deleteById: async (id) => {
        return await salesCollection.updateOne({ _id: id }, { $set: { deleted_at: new Date() } });
    },
    updateById: async (id, product) => {

        product.updated_at = new Date();
        let result = await salesCollection.updateOne({ _id: id }, { $set: product });

        if (result.modifiedCount === 0) {
            return null; // No document was updated
        }

        return await salesCollection.findOne({ _id: id });
    },

    add: async (product) => {

        product.created_at = new Date();
        product.updated_at = null;
        let _id = await salesCollection.insertOne(product);

        return await salesCollection.findOne({ _id: _id.insertedId })
    },
    seedData: async()=>{

        const sales = fs.readFileSync("jsons/sales.json", "utf8");
        const sales_json = JSON.parse(sales);

        await salesCollection.insertMany(sales_json)

    }

}

module.exports = SaleModel;