import supplierModel from "../Models/SupplierModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";



const supplierController = {};



supplierController.upsertSupplier = async (req, res) => {
    try {
        validationService.validateRequired(req.body, ["name", "vendorCode", "address", "location", "contact", "gstin", "status"]);
        const reqObj = {
            name: req.body.name,
            vendorCode: req.body.vendorCode,
            address: req.body.address,
            location: req.body.location,
            contact: req.body.contact,
            gstin: req.body.gstin,
            status: req.body.status,
            id: req.params.id
        }
        const results = await supplierModel.upsertSupplier(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


supplierController.getSuppliers = async (req, res) => {
    try {
        validationService.validateRequired(req.query, ['page', 'per_page']);

        const result = await supplierModel.getSuppliers(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

supplierController.deleteSupplier = async (req, res) => {
    try {
        validationService.validateRequired({ id: req.params.id }, ['id']);
        await supplierModel.deleteSupplier(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


export default supplierController;