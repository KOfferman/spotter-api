import express, {Router, Request, Response} from 'express';
import {
  addProductsToDB,
  getAllProductsWithPagination,
  searchProduct,
  enpointError,
} from '../handlers/products';

const router: Router = express.Router();

// Define routes
router.get('/add-store-products', addProductsToDB);
router.get('/products', getAllProductsWithPagination);
router.get('/search', searchProduct);
router.get('*', enpointError);

export default router;
