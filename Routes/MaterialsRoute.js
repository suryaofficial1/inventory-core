
import express from 'express';
import materialsController from '../Controllers/MaterialsController.js';

const materialsRouter = express.Router();

materialsRouter.get('/material-list/:productionId', materialsController.getMaterials);
materialsRouter.post('/material', materialsController.upsertMaterial);
materialsRouter.post('/material/:id', materialsController.upsertMaterial);
materialsRouter.delete('/material/:id', materialsController.deleteMaterial);
materialsRouter.get('/purchase/:purchaseId/product/:productId/supplier/:sId', materialsController.getAvailableProductQty);
materialsRouter.get('/product/:productId/production/:id/purchase/:purchaseId', materialsController.getUsedMaterialsByProductOnProduction);


export default materialsRouter

