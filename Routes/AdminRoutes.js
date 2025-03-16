
import express from 'express';
import adminController from '../Controllers/AdminController.js';
import authorize from '../Middlewares/AuthorizationUtils.js';
const adminRouter = express.Router();


adminRouter.post('/create-user', authorize, adminController.upsertUser)
adminRouter.post('/:id/user', authorize, adminController.upsertUser)
adminRouter.get('/users', authorize, adminController.getUsers);
adminRouter.get('/roles', authorize, adminController.getRoles);
adminRouter.get('/departments', authorize, adminController.getDepartments);
adminRouter.delete('/:id/user', authorize, adminController.deleteUser);
export default adminRouter



