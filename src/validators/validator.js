const Joi = require('joi');

const Validator = {

    getSales: (data) => {
        let schema = Joi.object({
            startDate: Joi.date()
                .iso()
                .optional()
                .allow('')
                .messages({
                    'date.base': `"startDate" must be a valid date`,
                    'date.format': `"startDate" must be in YYYY-MM-DD format`
                }),
            endDate: Joi.date()
                .iso()
                .optional()
                .allow('')
                .messages({
                    'date.base': `"endDate" must be a valid date`,
                    'date.format': `"endDate" must be in YYYY-MM-DD format`
                }),
            productId: Joi.string().allow('').optional(),
            categoryId: Joi.number().allow('').optional(),
        }).unknown(true);
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return {
                errored: true,
                errors: result.error.message.split('.'),
                value: result.value,
            };
        else return { errored: false, errors: null, value: result.value };
    },
    getSalesRevenueByPeriod: (data) => {
        let schema = Joi.object({
            periodOneStartDate: Joi.date()
                .required()
                .iso()
                .messages({
                    'date.base': `"Period One startDate" must be a valid date`,
                    'date.format': `"Period OnestartDate" must be in YYYY-MM-DD format`
                }),
            periodOneEndDate: Joi.date()
                .required()
                .iso()
                .messages({
                    'date.base': `"Period One endDate" must be a valid date`,
                    'date.format': `"Period One endDate" must be in YYYY-MM-DD format`
                }),
            periodTwoStartDate: Joi.date()
                .required()
                .iso()
                .messages({
                    'date.base': `"Period Two startDate" must be a valid date`,
                    'date.format': `"Period Two startDate" must be in YYYY-MM-DD format`
                }),
            periodTwoEndDate: Joi.date()
                .required()
                .iso()
                .messages({
                    'date.base': `"Period Two endDate" must be a valid date`,
                    'date.format': `"Period Two endDate" must be in YYYY-MM-DD format`
                })
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return {
                errored: true,
                errors: result.error.message.split('.'),
                value: result.value,
            };
        else return { errored: false, errors: null, value: result.value };
    },
    compareSalesRevenueByCategories: (data) => {
        let schema = Joi.object({
            categoryOneId: Joi.number().required(),
            categoryTwoId: Joi.number().required() 
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return {
                errored: true,
                errors: result.error.message.split('.'),
                value: result.value,
            };
        else return { errored: false, errors: null, value: result.value };
    },
    updateInventory: (data) => {
        let schema = Joi.object({
            quantity: Joi.number().required()
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return {
                errored: true,
                errors: result.error.message.split('.'),
                value: result.value,
            };
        else return { errored: false, errors: null, value: result.value };
    },

    addProduct: (data) => {
        let schema = Joi.object({
            product_name: Joi.string().required(),
            category_id : Joi.number().required(),
            price_per_unit : Joi.number().required(),
            product_id : Joi.string().required()
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return {
                errored: true,
                errors: result.error.message.split('.'),
                value: result.value,
            };
        else return { errored: false, errors: null, value: result.value };
    },

    updateProduct: (data) => {
        let schema = Joi.object({
            product_name: Joi.string().optional(),
            category_id : Joi.number().optional(),
            price_per_unit : Joi.number().optional()
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return {
                errored: true,
                errors: result.error.message.split('.'),
                value: result.value,
            };
        else return { errored: false, errors: null, value: result.value };
    },

}


module.exports = Validator;
