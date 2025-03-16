import salesModel from "../Models/SalesModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const salesController = {};

salesController.upsertSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "customer",
            "product",
            "invoiceNo",
            "pDesc",
            "salesDate",
            "qty",
            "salesPrice",
            "unit",
            "status"
        ]);
        if (error) return res.send(getErrorObject(400, 'Bad request', error));
        const reqObj = {
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
        const results = await salesModel.upsertSales(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

salesController.getSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await salesModel.getSales(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

salesController.deleteSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        await salesModel.deleteSales(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


// Return API 

salesController.getSalesReturnList = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await salesModel.getSalesReturnList(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error In getSalesReturnList", err));
    }
};


salesController.getSalesByInvoiceNo = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['invoiceNo']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await salesModel.getSalesByInvoiceNo(req.query.invoiceNo);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getSalesByInvoiceNo", err));
    }
};

salesController.getSalesReturnByInvoiceNo = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['invoiceNo']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await salesModel.getSalesReturnByInvoiceNo(req.query.invoiceNo);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getSalesReturnByInvoiceNo", err));
    }
};


salesController.deleteSalesDetails = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
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
        if (error) return res.send(getErrorObject(400, 'Bad request', error));
        const isExitSalesDetails = await salesModel.getSalesByInvoiceNo(req.body.invoiceNo);
        if (!isExitSalesDetails.length) {
            return res.send(getErrorObject(404, 'Sales details not found'));
        }
        const reqObj = {
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
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in upsertSalesReturn", err));
    }
};

salesController.deleteSalesReturn = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        await salesModel.deleteSalesReturn(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in deleteSalesReturn", err));
    }
};


export default salesController;