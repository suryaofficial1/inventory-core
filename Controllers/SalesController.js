import publicModel from "../Models/PublicModel.js";
import salesModel from "../Models/SalesModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const salesController = {};

salesController.upsertSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "productionId",
            "product",
            "customer",
            "invoiceNo",
            "pDesc",
            "salesDate",
            "qty",
            "salesPrice",
            "unit",
            "status"
        ]);

        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const reqObj = {
            productionId: req.body.productionId,
            customer: req.body.customer,
            product: req.body.product,
            invoiceNo: req.body.invoiceNo,
            pDesc: req.body.pDesc,
            salesDate: req.body.salesDate,
            qty: req.body.qty,
            salesPrice: req.body.salesPrice,
            unit: req.body.unit,
            status: req.body.status,
            id: req.params.id ? req.params.id : null
        }

        // Fetch product availability details

        const reqBody = {
            productId: req.body.product,
            type: 'sales',
            customerId: 0
        };

        const isExitProductOnSales = await salesModel.getSalesDetails(req.body.product, req.body.customer);
        const productDetails = await salesModel.getSalesItemAvailableQty(reqBody);

        // Validate product existence and stock availability

        if (req.params.id == null && isExitProductOnSales?.id) {
            return res.send(getErrorObject(400, 'Bad request', 'Product is already in sales.'));
        }

        if (Number(productDetails.availableQty == 0)) {
            return res.send(getErrorObject(400, 'Bad request', 'Stock is not available.'));
        }
        // Validate product existence and stock availability

        if (Number(req.body.qty) != Number(productDetails.availableQty) && Number(req.body.qty) > Number(productDetails.availableQty)) {
            return res.send(getErrorObject(400, 'Bad request', `Only ${productDetails.availableQty} units are in stock. Please enter a valid quantity.`));
        }
        const results = await salesModel.upsertSales(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in upsertSales", err));
    }
};

salesController.getSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const result = await salesModel.getSales(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getSales", err));
    }
};

salesController.deleteSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        await salesModel.deleteSales(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in deleteSales", err));
    }
};


// Return API 

salesController.getSalesReturnList = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const result = await salesModel.getSalesReturnList(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error In getSalesReturnList", err));
    }
};


salesController.getSalesByInvoiceNo = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['invoiceNo']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const result = await salesModel.getSalesByInvoiceNo(req.query.invoiceNo);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getSalesByInvoiceNo", err));
    }
};

salesController.getSalesReturnByInvoiceNo = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['invoiceNo']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const result = await salesModel.getSalesReturnByInvoiceNo(req.query.invoiceNo);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getSalesReturnByInvoiceNo", err));
    }
};


salesController.deleteSalesDetails = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        await salesModel.deleteSalesDetails(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getSalesByInvoiceNo", err));
    }
};


salesController.upsertSalesReturn = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "productionId",
            "salesId",
            "customer",
            "product",
            "invoiceNo",
            "rDesc",
            "qty",
            "salesPrice",
            "unit",
            "status"
        ]);

        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const reqBody = {
            productId: req.body.product,
            type: 'sales_return',
            customerId: req.body.customer || 0
        };

        const productDetails = await salesModel.getSalesItemAvailableQty(reqBody);

        // Validate product existence and stock availability

        if (req.params.id == null && !productDetails.salesId) {
            return res.send(getErrorObject(400, 'Bad request', 'Product is not available.'));
        }
        if (Number(productDetails.availableQty == 0)) {
            return res.send(getErrorObject(400, 'Bad request', 'Stock is not available.'));
        }
        if (Number(req.body.qty) != Number(productDetails.availableQty) && Number(req.body.qty) > Number(productDetails.availableQty)) {
            return res.send(getErrorObject(400, 'Bad request', `Only ${productDetails.availableQty} units are in stock. Please enter a valid quantity.`));
        }


        const reqObj = {
            productionId: req.body.productionId,
            salesId: req.body.salesId,
            customer: req.body.customer,
            product: req.body.product,
            invoiceNo: req.body.invoiceNo,
            rDesc: req.body.rDesc,
            qty: req.body.qty,
            salesPrice: req.body.salesPrice,
            unit: req.body.unit,
            status: req.body.status,
            id: req.params.id ? req.params.id : null
        }

        const results = await salesModel.upsertSalesReturn(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in upsertSalesReturn", err));
    }
};

salesController.deleteSalesReturn = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        await salesModel.deleteSalesReturn(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in deleteSalesReturn", err));
    }
};

salesController.getSalesItemAvailableQty = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const reqBody = {
            productId: req.params.id,
            type: req.query.type || '',
            customerId: req.query.customer || 0
        };
        const result = await salesModel.getSalesItemAvailableQty(reqBody);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getSalesItemAvailableQty", err));
    }
};

salesController.getExitingSalesProductDetails = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id', 'cId', 'type']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await salesModel.getExitingSalesProductDetails(req.params.id, req.params.cId, req.params.type);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getExitingSalesProductDetails", err));
    }
};



export default salesController;