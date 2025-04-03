import logger from "../core/app-loger.js";
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
        const result = await publicModel.getProducts();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getProducts", err));
    }
};
publicController.getAvailableProductQty = async (req, res, next) => {
    try {
        validationService.validateRequired(req.params, ['id']);
        const result = await publicModel.getAvailableProductQty(req.params.by, req.params.type, req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        logger.error('Internal Server Error in getAvailableProductQt', err);
        res.send(getErrorObject(500, "Internal Server Error in getAvailableProductQty", err));
    }
};

export default publicController;

