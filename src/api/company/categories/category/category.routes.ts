// LIBS
import { Router } from 'express';

// FUNCTIONS
// import { editCategory } from '../../../shared/categories/category/controllers/editCategory';

import { createCategory } from './controllers/createCategory';

export const categoryRouter = Router();

categoryRouter.post('/create', createCategory);
// categoryRouter.put('/edit', editCategory);

// categoryRouter.delete('/delete', deleteCategory);
// categoryRouter.get('/list', listCategory);
