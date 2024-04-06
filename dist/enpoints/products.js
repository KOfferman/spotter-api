"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = require("../handlers/products");
const router = express_1.default.Router();
// Define routes
router.get('/add-store-products', products_1.addProductsToDB);
router.get('/products', products_1.getAllProductsWithPagination);
router.get('/search', products_1.searchProduct);
router.get('*', products_1.enpointError);
exports.default = router;
