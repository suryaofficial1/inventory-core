import reportModel from "../Models/ReportModel.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";


const reportController = {};


reportController.getSalesOverview = async (req, res) => {
    try {
        const result = await reportModel.getSalesOverview(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error getSalesOverview", err));
    }
};
reportController.getSalesReturnOverview = async (req, res) => {
    try {
        const result = await reportModel.getSalesReturnOverview(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error getSalesReturnOverview", err));
    }
};

reportController.getPurchaseReports = async (req, res) => {
    try {
        const result = await reportModel.getPurchaseReports(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error getPurchaseReports", err));
    }
};
reportController.getPurchaseReturnReports = async (req, res) => {
    try {
        const result = await reportModel.getPurchaseReturnReports(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error getPurchaseReturnReports", err));
    }
};
reportController.getPurchaseReports = async (req, res) => {
    try {
        const result = await reportModel.getPurchaseReports(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error getPurchaseReports", err));
    }
};

reportController.getStockReports = async (req, res) => {
    try {
        const result = await reportModel.getStockReports(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error getStockReports", err));
    }
};


export default reportController;