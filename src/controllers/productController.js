
const Utils = require('../../utils/utils');
const ProductModel = require('../models/products');
const { ObjectId } = require('mongodb');
const Validator = require('../validators/validator');
const ProductController = {

    getProducts: async (req, res) => {
        try {
            const products = await ProductModel.getAll({});

            return Utils.sendSuccessResponse(res, products);
        } catch (error) {
            console.error('Error fetching products:', error);
            return Utils.sendErrorResponse(res, { message: error.message });

        }
    },

    createProduct: async (req, res) => {
        try {

            let body = req.body
            let validated = Validator.addProduct(body)

            if (validated.errored) return Utils.sendUnProcessableIdentityResponse(res,{ message: validated.errors[0], error : validated.errors });
    	
            if (await ProductModel.getByFilter({product_id:body.product_id})){
                return Utils.sendUnProcessableIdentityResponse(res, { message: 'Product already exists with this product id' });
            }

            const product = await ProductModel.add(body);
            return Utils.sendSuccessResponse(res, product)
        } catch (error) {
            console.error('Error creating product:', error);
            return Utils.sendErrorResponse(res, { message: error.message });

        }
    },

    getProductById: async (req, res) => {
        try {
            const productId = new ObjectId(req.params.id);
            const product = await ProductModel.getByFilter({_id:productId});
            if (!product) {
                return Utils.sendNotFoundResponse(res, { message: 'Product not found' });
            }
            return Utils.sendSuccessResponse(res, product)
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            return Utils.sendErrorResponse(res, { message: error.message });

        }
    },

    deleteProductById: async (req, res) => {
        try {
            const productId = new ObjectId(req.params.id);
            const result = await ProductModel.deleteById(productId);
            if (result.deletedCount === 0) {
                return Utils.sendNotFoundResponse(res, { message: 'Product not found' });
            }
            return Utils.sendSuccessResponse(res, {})

        } catch (error) {
            console.error('Error deleting product by ID:', error);
            return Utils.sendErrorResponse(res, { message: error.message });

        }
    },

    updateProductById: async (req, res) => {
        try {
            const productId = new ObjectId(req.params.id);
            
            let body = req.body
            let validated = Validator.updateProduct(body)

            if (validated.errored) return Utils.sendUnProcessableIdentityResponse(res,{ message: validated.errors[0], error : validated.errors });
    	
            const updatedProduct = await ProductModel.updateById(productId, body);
            if (!updatedProduct) {
                return Utils.sendNotFoundResponse(res, { message: 'Product not found' });
            }
            return Utils.sendSuccessResponse(res, updatedProduct)
        } catch (error) {
            console.error('Error updating product by ID:', error);
            return Utils.sendErrorResponse(res, { message: error.message });
        }
    }



}


module.exports = ProductController;