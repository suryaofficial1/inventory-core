
import express from 'express';
import salesController from '../Controllers/SalesController.js';
import authorize from '../Middlewares/AuthorizationUtils.js';
const salesRouter = express.Router();

salesRouter.get('/sales-list', authorize, salesController.getSales);
salesRouter.post('/sales', authorize, salesController.upsertSales);
salesRouter.post('/sales/:id', authorize, salesController.upsertSales);
salesRouter.delete('/sales/:id', authorize, salesController.deleteSales);

// Return
salesRouter.get('/list-by-invoice', authorize, salesController.getSalesByInvoiceNo);
salesRouter.get('/return-list-by-invoice', authorize, salesController.getSalesReturnByInvoiceNo);
salesRouter.get('/return-list', authorize, salesController.getSalesReturnList);
salesRouter.post('/upsert/return', authorize, salesController.upsertSalesReturn);
salesRouter.post('/upsert/return/:id', authorize, salesController.upsertSalesReturn);
salesRouter.delete('/return/:id', authorize, salesController.deleteSalesReturn);



export default salesRouter

