import materialsModel from "../Models/MaterialsModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";


const materialsController = {};

materialsController.upsertMaterial = async (req, res) => {
    try {

        const error = validationService.validateRequired(req.body, [
            "productionId",
            "product",
            "mqty",
            "mPrice",
            // "rqty",
            // "rPrice",
            // "lqty",
            // "lPrice"
        ]);
        if(error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const reqObj = {
            productionId: req.body.productionId,
            product: req.body.product,
            mqty: req.body.mqty,
            mPrice: req.body.mPrice,
            rqty: req.body.rqty,
            rPrice: req.body.rPrice,
            lqty: req.body.lqty,
            lPrice: req.body.lPrice,
            id: req.params.id ? req.params.id : null
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
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
       const result = await materialsModel.getAvailableProductQty(req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getAvailableProductQty", err));
    }
};


export default materialsController;