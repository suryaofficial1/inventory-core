import materialsModel from "../Models/MaterialsModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";


const materialsController = {};

materialsController.upsertMaterial = async (req, res) => {
    try {

        const error = validationService.validateRequired(req.body, [
            "productionId",
            "product",
            "supplier",
            "mqty",
            "mPrice",
        ]);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const reqObj = {
            productionId: req.body.productionId,
            purchaseId: req.body.purchaseId,
            product: req.body.product,
            supplier: req.body.supplier,
            mqty: req.body.mqty,
            mPrice: req.body.mPrice,
            rqty: req.body.rqty || 0,
            rPrice: req.body.rPrice || 0,
            lqty: req.body.lqty || 0,
            lPrice: req.body.lPrice || 0,
            id: req.params.id ? req.params.id : null
        }

        const isExists = await materialsModel.getUsedMaterialsByProductOnProduction({productId: req.body.product, purchaseId: req.body.purchaseId, id: req.body.productionId });
        if (isExists.length) {
            return res.send(getErrorObject(400, 'Bad request', 'Material already exists'));
        }
        const results = await materialsModel.upsertMaterial(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error upsertMaterial", err));
    }
};

materialsController.getMaterials = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['productionId']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const result = await materialsModel.getMaterials(req.params.productionId);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getMaterials", err));
    }
};

materialsController.deleteMaterial = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        await materialsModel.deleteMaterial(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error deleteMaterial", err));
    }
};
materialsController.getAvailableProductQty = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['purchaseId','productId', 'sId']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await materialsModel.getAvailableProductQty(req.params);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getAvailableProductQty", err));
    }
};

materialsController.getUsedMaterialsByProductOnProduction = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['productId', 'purchaseId', 'id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await materialsModel.getUsedMaterialsByProductOnProduction(req.params);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getUsedMaterialsByProductOnProduction", err));
    }
};


export default materialsController;