import publicModel from "../Models/PublicModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const publicController = {};
publicController.getSuppliers = async (req, res) => {
    try {
        const result = await publicModel.getSuppliers();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getSuppliers", err));
    }
};

publicController.getCustomers = async (req, res) => {
    try {
        const result = await publicModel.getCustomers();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getCustomers", err));
    }
};
publicController.getProducts = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['type']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await publicModel.getProducts(req.params.type, req.query.product);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getProducts", err));
    }
};

publicController.getPurchaseProducts = async (req, res) => {
    try {
        const result = await publicModel.getPurchaseProducts();
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getPurchaseProducts", err));
    }
};
publicController.getProductionProducts = async (req, res) => {
    try {
        const result = await publicModel.getProductionProducts();
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getProductionProducts", err));
    }
};

publicController.getProductionProductsDetails = async (req, res) => {
    try {
        const result = await publicModel.getProductionProductsDetails(req.query.product, req.query.status);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getProductionProductsDetails", err));
    }
};

publicController.getSalesProducts = async (req, res) => {
    try {
        const result = await publicModel.getSalesProducts(req.query.product, req.query.cId);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getSalesProducts", err));
    }
};

publicController.getSalesReturnProducts = async (req, res) => {
    try {
        const result = await publicModel.getSalesReturnProducts(req.query.product);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getSalesReturnProducts", err));
    }
};

publicController.getAvailableProductQty = async (req, res, next) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await publicModel.getAvailableProductQty(req.params.by, req.params.type, req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getAvailableProductQty", err));
    }
};

publicController.getAllStatsCount = async (req, res) => {
    try {
        const result = await publicModel.getAllStatsCount();
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getAllStatsCount", err));
    }
};

publicController.getTop5Products = async (req, res) => {
    try {
        const result = await publicModel.getTop5Products();
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getTop5Products", err));
    }
};

publicController.getProductionSummary = async (req, res) => {
    try {
        const result = await publicModel.getProductionSummary();
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getProductionSummary", err));
    }
};


publicController.getProductNameByType = async (req, res, next) => {
    try {
        const error = validationService.validateRequired(req.query, ['product', 'type']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await publicModel.getProductNameByType(req.query.product, req.query.type);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getProductNameByType", err));
    }
};

export default publicController;

