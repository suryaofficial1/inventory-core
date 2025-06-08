
import express from 'express';
import purchaseController from '../Controllers/PurchaseController.js';
import authorize, { authorizeSuperAdmin } from '../Middlewares/AuthorizationUtils.js';
const purchaseRouter = express.Router();

purchaseRouter.get('/purchase-list', authorize, purchaseController.getPurchaseList);
purchaseRouter.post('/purchase', authorize, authorizeSuperAdmin, purchaseController.upsertPurchase);
purchaseRouter.post('/purchase/:id', authorize, authorizeSuperAdmin, purchaseController.upsertPurchase);
purchaseRouter.delete('/purchase/:id', authorize, authorizeSuperAdmin, purchaseController.deletePurchaseDetails);


// Return
purchaseRouter.get('/list-by-product', authorize, purchaseController.getPurchaseByProduct);
purchaseRouter.get('/return-list-by-product', authorize, purchaseController.getPurchaseReturnByProduct);
purchaseRouter.get('/return-list-by-invoice', authorize, purchaseController.getPurchaseReturnByInvoiceNo);
purchaseRouter.get('/return-list', authorize, purchaseController.getPurchaseReturnList);
purchaseRouter.post('/upsert/return', authorize, authorizeSuperAdmin, purchaseController.upsertPurchaseReturn);
purchaseRouter.post('/upsert/return/:id', authorize, authorizeSuperAdmin, purchaseController.upsertPurchaseReturn);
purchaseRouter.delete('/return/:id', authorize, authorizeSuperAdmin, purchaseController.deletePurchaseReturn);


purchaseRouter.get('/details', authorize, purchaseController.getPurchaseDetailsByProduct);
purchaseRouter.get('/:id/product/:sId/supplier/:type', authorize, purchaseController.getPurchaseDetailsByProductId);
export default purchaseRouter

