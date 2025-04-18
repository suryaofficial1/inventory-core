
import express from 'express';
import publicController from '../Controllers/PublicController.js';
const publicRouter = express.Router();

publicRouter.get('/suppliers-list', publicController.getSuppliers);
publicRouter.get('/products-list', publicController.getProducts);
publicRouter.get('/customers-list', publicController.getCustomers);
publicRouter.get('/products/:id/:by/:type', publicController.getAvailableProductQty);

export default publicRouter



