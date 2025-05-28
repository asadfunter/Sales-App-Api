
const Utils = require('../../utils/utils');
const SaleModel = require('../models/sales');
const { ObjectId } = require('mongodb');
const Validator = require('../validators/validator');
const SalesController = {

    getSales: async (req, res) => {
        try {

            let query = req.query

            let validated = Validator.getSales(query)

            if (validated.errored) return Utils.sendUnProcessableIdentityResponse(res,{ message: validated.errors[0], error : validated.errors });
    	
            let paginate = query.paginate && query.paginate=="true"?true:false
            let currentPage = query.currentPage?+query.currentPage : 1
            let limit = query.perPage?+query.perPage : 20

            const data = await SaleModel.getAll(query, currentPage, limit, paginate);
            return Utils.sendSuccessResponse(res, data);
        } catch (error) {
            console.error('Error fetching sales:', error);
            return Utils.sendErrorResponse(res, { message: 'Sales not found' });
        }
    },

    getSalesRevenue: async (req, res) => {
        try {
        
            const {period} = req.query
            const data = await SaleModel.getRevenue(period);
            return Utils.sendSuccessResponse(res, data);
        
        } catch (error) {
            console.error('Error fetching sales:', error);
            return Utils.sendErrorResponse(res, { message: error.message });
        }
    },

    compareSalesRevenueByPeriod: async (req, res) => {
        try {
        
            let query = req.query

            let validated = Validator.getSalesRevenueByPeriod(query)

            console.log({validated})
            if (validated.errored) return Utils.sendUnProcessableIdentityResponse(res,{ message: validated.errors[0], error : validated.errors });
    	
            const data = await SaleModel.compareSalesRevenueByPeriod(query);
            return Utils.sendSuccessResponse(res, data);
        
        } catch (error) {
            console.error('Error fetching sales:', error);
            return Utils.sendErrorResponse(res, { message: error.message });
        }
    },


    compareSalesRevenueByCategories: async (req, res) => {
        try {
        
            let query = req.query

            let validated = Validator.compareSalesRevenueByCategories(query)

            console.log({validated})
            if (validated.errored) return Utils.sendUnProcessableIdentityResponse(res,{ message: validated.errors[0], error : validated.errors });
    	
            const data = await SaleModel.compareSalesRevenueByCategories(query);
            return Utils.sendSuccessResponse(res, data);
        
        } catch (error) {
            console.error('Error fetching sales:', error);
            return Utils.sendErrorResponse(res, { message: error.message });
        }
    },
}


module.exports = SalesController;