import materialsModel from "../Models/MaterialsModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";


const materialsController = {};

materialsController.upsertMaterial = async (req, res) => {
    try {

        validationService.validateRequired(req.body, [
            "materials",
            "mqty",
            "mPrice",
            "rqty",
            "rPrice",
            "lqty",
            "lPrice",
            "status"
        ]);

        const reqObj = {
            materials: req.body.materials,
            mqty: req.body.mqty,
            mPrice: req.body.mPrice,
            rqty: req.body.rqty,
            rPrice: req.body.rPrice,
            lqty: req.body.lqty,
            lPrice: req.body.lPrice,
            status: req.body.status,
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
        validationService.validateRequired(req.query, ['page', 'per_page']);
        
        const result = await materialsModel.getMaterials(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getMaterials", err));
    }
};

materialsController.deleteMaterial = async (req, res) => {
    try {
        validationService.validateRequired(req.params, ['id']);
        
        await materialsModel.deleteMaterial(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error deleteMaterial", err));
    }
};


export default materialsController;