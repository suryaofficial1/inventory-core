
import express from 'express';
import reportController from '../Controllers/RreportController.js';

const reportRouter = express.Router();

reportRouter.get('/sales-overview', reportController.getSalesOverview);
reportRouter.get('/sales-return-overview', reportController.getSalesReturnOverview);
reportRouter.get('/purchase', reportController.getPurchaseReports);
reportRouter.get('/purchase-return', reportController.getPurchaseReturnReports);
reportRouter.get('/stock', reportController.getStockReports);


export default reportRouter

