import purchaseModel from "../Models/PurchaseModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const purchaseController = {};

purchaseController.upsertPurchase = async (req, res) => {
    try {
        validationService.validateRequired(req.body, [
            "supplier",
            "product",
            "invoiceNo",
            "bNumber",
            "description",
            "qty",
            "price",
            "unit",
            "status",
            "purchaseDate",
            "expiryDate",
        ]);
        const reqObj = {
            supplier: req.body.supplier,
            product: req.body.product,
            invoiceNo: req.body.invoiceNo,
            bNumber: req.body.bNumber,
            description: req.body.description,
            qty: req.body.qty,
            price: req.body.price,
            unit: req.body.unit,
            status: req.body.status,
            purchaseDate: req.body.purchaseDate,
            expiryDate: req.body.expiryDate,
            id: req.params.id ? req.params.id : null
        }
        const results = await purchaseModel.upsertPurchase(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};



purchaseController.getPurchaseList = async (req, res) => {
    try {
        validationService.validateRequired(req.query, ['page', 'per_page']);

        const result = await purchaseModel.getPurchaseList(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};



purchaseController.getPurchaseReturnList = async (req, res) => {
    try {
        validationService.validateRequired(req.query, ['page', 'per_page']);

        const result = await purchaseModel.getPurchaseReturnList(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error In getPurchaseReturnList", err));
    }
};


purchaseController.getPurchaseByInvoiceNo = async (req, res) => {
    try {
        validationService.validateRequired(req.query, ['invoiceNo']);

        const result = await purchaseModel.getPurchaseByInvoiceNo(req.query.invoiceNo);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

purchaseController.getPurchaseReturnByInvoiceNo = async (req, res) => {
    try {
        validationService.validateRequired(req.query, ['invoiceNo']);

        const result = await purchaseModel.getPurchaseReturnByInvoiceNo(req.query.invoiceNo);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error : getPurchaseReturnByInvoiceNo", err));
    }
};


purchaseController.deletePurchaseDetails = async (req, res) => {
    try {
        validationService.validateRequired(req.params, ['id']);

        await purchaseModel.deletePurchaseDetails(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


// Return API 

purchaseController.upsertPurchaseReturn = async (req, res) => {
    try {
        validationService.validateRequired(req.body, [
            "purchaseId",
            "supplier",
            "product",
            "invoiceNo",
            "bNumber",
            "desc",
            "qty",
            "price",
            "unit",
        ]);
        const isExitPurchaseDetails = await purchaseModel.getPurchaseByInvoiceNo(req.body.invoiceNo);
        if (!isExitPurchaseDetails.length) {
            return res.send(getErrorObject(404, 'Purchase details not found'));
        }
        const reqObj = {
            purchaseId: req.body.purchaseId,
            supplier: req.body.supplier,
            product: req.body.product,
            invoiceNo: req.body.invoiceNo,
            bNumber: req.body.bNumber,
            qty: req.body.qty,
            price: req.body.price,
            unit: req.body.unit,
            desc: req.body.desc,
            id: req.params.id ? req.params.id : null
        }
        const results = await purchaseModel.upsertPurchaseReturn(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

purchaseController.deletePurchaseReturn = async (req, res) => {
    try {
        validationService.validateRequired(req.params, ['id']);

        await purchaseModel.deletePurchaseReturn(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in deletePurchaseReturn", err));
    }
};


export default purchaseController;