// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createCategory } from '../../../shared/categories/category/controllers/createCategory';
import { deleteCategory } from './controllers/deleteCategory';
import { editCategory } from '../../../shared/categories/category/controllers/editCategory';
import { listCategory } from './controllers/listCategory';

export const categoryRouter = Router();

categoryRouter.post('/create', createCategory);
categoryRouter.put('/edit', editCategory);
categoryRouter.delete('/delete', deleteCategory);
categoryRouter.get('/list', listCategory);
