
import express from 'express';
import productController from '../Controllers/ProductController.js';
import authorize, { authorizeSuperAdmin } from '../Middlewares/AuthorizationUtils.js';
const productRouter = express.Router();

productRouter.get('/products', authorize, productController.getProducts);
productRouter.post('/product', authorize, authorizeSuperAdmin, productController.upsertProduct);
productRouter.post('/product/:id', authorize, authorizeSuperAdmin, productController.upsertProduct);
productRouter.delete('/product/:id', authorize, authorizeSuperAdmin, productController.deleteProduct);


export default productRouter

