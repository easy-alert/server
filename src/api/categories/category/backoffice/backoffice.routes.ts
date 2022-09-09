// LIBS
import { Router } from 'express';
// VALIDATORS
import { isBackoffice } from '../../../../middlewares/permissions/isBackoffice';

// FUNCTIONS
import { createCategory } from './controllers/createCategory';
import { deleteCategory } from './controllers/deleteCategory';
import { editCategory } from './controllers/editCategory';

export const backofficeCategoryRouter = Router();

backofficeCategoryRouter.post('/create', isBackoffice, createCategory);
backofficeCategoryRouter.put('/edit', isBackoffice, editCategory);
backofficeCategoryRouter.delete('/delete', isBackoffice, deleteCategory);
