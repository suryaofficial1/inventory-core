
import express from 'express';
import reportController from '../Controllers/RreportController.js';

const reportRouter = express.Router();

reportRouter.get('/sales-overview', reportController.getSalesOverview);
reportRouter.get('/purchase', reportController.getPurchaseReports);


export default reportRouter

