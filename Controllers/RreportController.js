import reportModel from "../Models/ReportModel.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";


const reportController = {};


reportController.getSalesOverview = async (req, res) => {
    try {
        const result = await reportModel.getSalesOverview(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getSalesOverview", err));
    }
};

reportController.getPurchaseReports = async (req, res) => {
    try {
        const result = await reportModel.getPurchaseReports(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getPurchaseReports", err));
    }
};


export default reportController;