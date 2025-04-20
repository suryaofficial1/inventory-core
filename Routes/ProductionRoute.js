
import express from 'express';
import productionController from '../Controllers/ProductionController.js';

const productionRouter = express.Router();

productionRouter.get('/production-list', productionController.getProductions);
productionRouter.get('/production-detail/:id', productionController.getProductionDetail);
productionRouter.post('/production', productionController.upsertProduction);
productionRouter.post('/production/:id', productionController.upsertProduction);
productionRouter.delete('/production/:id', productionController.deleteProduction);
productionRouter.post('/:id/status', productionController.updateProductionStatus);

export default productionRouter

