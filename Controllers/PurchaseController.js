import materialsModel from "../Models/MaterialsModel.js";
import publicModel from "../Models/PublicModel.js";
import purchaseModel from "../Models/PurchaseModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const purchaseController = {};

purchaseController.upsertPurchase = async (req, res, next) => {
    try {
        // Validate required fields
        const error = validationService.validateRequired(req.body, [
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
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const purchaseData = {
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
        };

        const reqBody = {
            id: req.body.product,
            sId: req.body.supplier,
            type: "purchase"
        }

        // const isProductExit = await purchaseModel.getPurchaseDetailsByProductId(reqBody);

        // if (!req.params.id && isProductExit.id) {
        //     return res.send(getErrorObject(400, 'Bad request', 'Product is already purchase list.'));
        // }

        // Perform purchase record insertion/update
        const result = await purchaseModel.upsertPurchase(purchaseData);
        return res.send(getSuccessObject(result));

    } catch (error) {
        res.status(500).send(getErrorObject(500, "Internal Server Error in upsertPurchase", error));
    }
};


purchaseController.getPurchaseList = async (req, res,) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await purchaseModel.getPurchaseList(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error in getPurchaseList", err));
    }
};



purchaseController.getPurchaseReturnList = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await purchaseModel.getPurchaseReturnList(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error In getPurchaseReturnList", err));
    }
};

purchaseController.getPurchaseByProduct = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['product']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await purchaseModel.getPurchaseByProduct(req.query.product);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error : getPurchaseByProduct", err));
    }
};
purchaseController.getPurchaseReturnByProduct = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['product']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await purchaseModel.getPurchaseReturnByProduct(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error : getPurchaseReturnByProduct", err));
    }
};

purchaseController.getPurchaseReturnByInvoiceNo = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['invoiceNo']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await purchaseModel.getPurchaseReturnByInvoiceNo(req.query.invoiceNo);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error : getPurchaseReturnByInvoiceNo", err));
    }
};


purchaseController.deletePurchaseDetails = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        await purchaseModel.deletePurchaseDetails(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


// Return API 

purchaseController.upsertPurchaseReturn = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
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
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        const reqBody = {
            productId: req.body.product,
            sId: req.body.supplier,
            purchaseId: req.body.purchaseId
        }
        // Fetch product availability details
        const productAvailability = await materialsModel.getAvailableProductQty(reqBody);

        // Validate product existence and stock availability
        if (!productAvailability) {
            return res.send(getErrorObject(400, 'Bad request', 'Product is not available.'));

        }
        if (Number(req.body.qty) > Number(productAvailability.availableQty)) {
            return res.send(getErrorObject(400, 'Bad request', `Only ${productAvailability.availableQty} units are in stock. Please enter a valid quantity.`));
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
        await purchaseModel.upsertPurchaseReturn(reqObj);
        return res.send(getSuccessObject());
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

purchaseController.deletePurchaseReturn = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }

        await purchaseModel.deletePurchaseReturn(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in deletePurchaseReturn", err));
    }
};

purchaseController.getPurchaseDetailsByProduct = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['product', 'type']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await purchaseModel.getPurchaseDetailsByProduct(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error : getPurchaseDetailsByProduct", err));
    }
};

purchaseController.getPurchaseDetailsByProductId = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['purchaseId','productId', 'sId']);
        if (error.length) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await purchaseModel.getPurchaseDetailsByProductId(req.params);
        return res.send(getSuccessObject(result));
    } catch (err) {
        res.send(getErrorObject(500, "Internal Server Error : getPurchaseDetailsByProductId", err));
    }
};

export default purchaseController;