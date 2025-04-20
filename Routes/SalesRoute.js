
import express from 'express';
import salesController from '../Controllers/SalesController.js';
import authorize, { authorizeSuperAdmin } from '../Middlewares/AuthorizationUtils.js';
const salesRouter = express.Router();

salesRouter.get('/sales-list', authorize, salesController.getSales);
salesRouter.post('/sales', authorize, authorizeSuperAdmin, salesController.upsertSales);
salesRouter.post('/sales/:id', authorize, authorizeSuperAdmin, salesController.upsertSales);
salesRouter.delete('/sales/:id', authorize, authorizeSuperAdmin, salesController.deleteSales);
salesRouter.get('/:id/product', authorize, authorizeSuperAdmin, salesController.getProductDetails);

// Return
salesRouter.get('/list-by-invoice', authorize, salesController.getSalesByInvoiceNo);
salesRouter.get('/return-list-by-invoice', authorize, salesController.getSalesReturnByInvoiceNo);
salesRouter.get('/return-list', authorize, salesController.getSalesReturnList);
salesRouter.post('/upsert/return', authorize, authorizeSuperAdmin, salesController.upsertSalesReturn);
salesRouter.post('/upsert/return/:id', authorize, authorizeSuperAdmin, salesController.upsertSalesReturn);
salesRouter.delete('/return/:id', authorize, authorizeSuperAdmin, salesController.deleteSalesReturn);


export default salesRouter

