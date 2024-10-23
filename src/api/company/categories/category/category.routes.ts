// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createCategory } from './controllers/createCategory';
import { deleteCategory } from './controllers/deleteCategory';
import { editCategory } from './controllers/editCategory';
import { listCategory } from './controllers/listCategory';
import { listForSelectCategory } from './controllers/listForSelectCategory';
import { sharedListCategoriesByCompanyId } from '../../../shared/categories/controllers/sharedListCategoriesByCompanyId';

export const categoryRouter = Router();

categoryRouter.post('/create', createCategory);
categoryRouter.put('/edit', editCategory);
categoryRouter.delete('/delete', deleteCategory);
categoryRouter.get('/list', listCategory);
categoryRouter.get('/listforselect', listForSelectCategory);
categoryRouter.get('/listByCompanyId/:companyId', sharedListCategoriesByCompanyId);
