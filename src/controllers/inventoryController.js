
const Utils = require('../../utils/utils');
const InventoryModel = require('../models/inventory');
const { ObjectId } = require('mongodb');
const Validator = require('../validators/validator');
const InventoryController = {

    getAll: async (req, res) => {
        try {
            let query = req.query
            let paginate = query.paginate && query.paginate == "true" ? true : false
            let currentPage = query.currentPage ? +query.currentPage : 1
            let limit = query.perPage ? +query.perPage : 20
            const data = await InventoryModel.getAll(query, currentPage, limit, paginate);

            return Utils.sendSuccessResponse(res, data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            return Utils.sendErrorResponse(res, { message: 'Inventory not found' });

        }
    },

    create: async (req, res) => {
        try {
            const inventory = await InventoryModel.add(req.body);
            return Utils.sendSuccessResponse(res, inventory)
        } catch (error) {
            console.error('Error creating inventory:', error);
            return Utils.sendErrorResponse(res, { message: 'Inventory not found' });

        }
    },

    getById: async (req, res) => {
        try {
            const inventoryId = new ObjectId(req.params.id);
            const inventory = await InventoryModel.getById(inventoryId);
            if (!inventory) {
                return Utils.sendNotFoundResponse(res, { message: 'Inventory not found' });
            }
            return Utils.sendSuccessResponse(res, inventory)
        } catch (error) {
            console.error('Error fetching inventory by ID:', error);
            return Utils.sendErrorResponse(res, { message: 'Inventory not found' });

        }
    },

    deleteById: async (req, res) => {
        try {
            const inventoryId = new ObjectId(req.params.id);
            const result = await InventoryModel.deleteById(inventoryId);
            if (result.deletedCount === 0) {
                return Utils.sendNotFoundResponse(res, { message: 'Inventory not found' });
            }
            return Utils.sendSuccessResponse(res, {})

        } catch (error) {
            console.error('Error deleting inventory by ID:', error);
            return Utils.sendErrorResponse(res, { message: 'Inventory not found' });

        }
    },

    updateById: async (req, res) => {
        try {
            const inventoryId = new ObjectId(req.params.id);
            const updatedProduct = await InventoryModel.updateById(inventoryId, req.body);
            if (!updatedProduct) {
                return Utils.sendNotFoundResponse(res, { message: 'Inventory not found' });
            }
            return Utils.sendSuccessResponse(res, updatedProduct)
        } catch (error) {
            console.error('Error updating inventory by ID:', error);
            return Utils.sendErrorResponse(res, { message: 'Inventory not found' });
        }
    },

    addStock: async (req, res) => {
        try {
            const inventoryId = req.params.id;
            let body = req.body;
            let validated = Validator.updateInventory(body)

            if (validated.errored) return Utils.sendUnProcessableIdentityResponse(res,{ message: validated.errors[0], error : validated.errors });
            
            console.log({inventoryId})
            const updatedProduct = await InventoryModel.addStock(inventoryId, body.quantity);
            if (!updatedProduct) {
                return Utils.sendNotFoundResponse(res, { message: 'Inventory not found' });
            }
            return Utils.sendSuccessResponse(res, updatedProduct)
        } catch (error) {
            console.error('Error updating inventory by ID:', error);
            return Utils.sendErrorResponse(res, { message: 'Inventory not found' });
        }
    }



}


module.exports = InventoryController;