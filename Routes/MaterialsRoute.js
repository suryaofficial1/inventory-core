
import express from 'express';
import materialsController from '../Controllers/MaterialsController.js';

const materialsRouter = express.Router();

materialsRouter.get('/material-list/:productionId', materialsController.getMaterials);
materialsRouter.post('/material', materialsController.upsertMaterial);
materialsRouter.post('/material/:id', materialsController.upsertMaterial);
materialsRouter.delete('/material/:id', materialsController.deleteMaterial);
materialsRouter.get('/:id/product/:sId/supplier', materialsController.getAvailableProductQty);
materialsRouter.get('/product/:productId/production/:id', materialsController.getUsedMaterialsByProductOnProduction);


export default materialsRouter

