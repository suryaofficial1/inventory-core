
import express from 'express';
import publicController from '../Controllers/PublicController.js';
import authorize from '../Middlewares/AuthorizationUtils.js';
const publicRouter = express.Router();

publicRouter.get('/suppliers-list', authorize, publicController.getSuppliers);
publicRouter.get('/products-list/:type', authorize, publicController.getProducts);
publicRouter.get('/customers-list', authorize, publicController.getCustomers);
publicRouter.get('/products/:id/:by/:type', authorize, publicController.getAvailableProductQty);
publicRouter.get('/purchase-products-list', authorize, publicController.getPurchaseProducts);
publicRouter.get('/production-products-list', authorize, publicController.getProductionProducts);
publicRouter.get('/all-stats-count', authorize ,publicController.getAllStatsCount);
publicRouter.get('/top-5-products', authorize ,publicController.getTop5Products);
publicRouter.get('/production-summary', authorize ,publicController.getProductionSummary);
publicRouter.get('/production-products-details', authorize, publicController.getProductionProductsDetails);
publicRouter.get('/sales-products-list', authorize, publicController.getSalesProducts);
publicRouter.get('/sales-return-products-list', authorize, publicController.getSalesReturnProducts);

publicRouter.get('/product-name-by-type', authorize, publicController.getProductNameByType);
export default publicRouter



