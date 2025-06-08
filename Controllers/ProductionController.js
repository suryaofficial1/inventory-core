import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";
import productionModel from "../Models/ProductionModel.js";


const productionController = {};

productionController.upsertProduction = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "customer",
            "manufacturingDate",
            "product",
            "qty",
            "unit",
            "operatorName",
            "pDesc",
            "status"
        ]);

        const reqObj = {
            customer: req.body.customer,
            manufacturingDate: req.body.manufacturingDate,
            product: req.body.product,
            qty: req.body.qty,
            unit: req.body.unit,
            operatorName: req.body.operatorName,
            pDesc: req.body.pDesc,
            status: req.body.status,
            id: req.params.id ? req.params.id : null
        }
        const results = await productionModel.upsertProduction(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error upsertProduction", err));
    }
};

productionController.updateProductionStatus = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ['status']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await productionModel.updateProductionStatus(req.body.status, req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error updateProductionStatus", err));
    }
};
productionController.getProductions = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await productionModel.getProductions(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getProductions", err));
    }
};

productionController.getProductionDetail = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await productionModel.getProductionDetail(req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getProductionDetail", err));
    }
};

productionController.getProductionDetailByProduct = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await productionModel.getProductionDetailByProduct(req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getProductionDetailByProduct", err));
    }
};

productionController.deleteProduction = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        await productionModel.deleteProduction(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error deleteProduction", err));
    }
};


export default productionController;