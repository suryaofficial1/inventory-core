
import express from 'express';
import customerController from '../Controllers/CustomerController.js';
import authorize from '../Middlewares/AuthorizationUtils.js';
const customerRouter = express.Router();

customerRouter.get('/customers', authorize, customerController.getCustomers);
customerRouter.post('/customer', authorize, customerController.upsertCustomer);
customerRouter.post('/customer/:id', authorize, customerController.upsertCustomer);
customerRouter.delete('/customer/:id', authorize, customerController.deleteCustomer);
export default customerRouter