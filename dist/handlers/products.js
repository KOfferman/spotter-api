"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enpointError = exports.searchProduct = exports.getAllProductsWithPagination = exports.getAllProducts = exports.addProductsToDB = void 0;
const axios_1 = __importDefault(require("axios"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const utils_1 = require("../utils/utils");
require('dotenv').config();
aws_sdk_1.default.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
// Create a DynamoDB DocumentClient
const docClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
// Define the URL from which to fetch JSON data
const jsonDataUrl = 'https://spotter-interview-files.s3.amazonaws.com/take-home-data-facet.json';
// Route handler to store JSON data in DynamoDB
const addProductsToDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch JSON data from the specified URL
        const response = yield axios_1.default.get(jsonDataUrl);
        const jsonData = response.data.map((product) => {
            const newDataProduct = Object.assign(Object.assign({}, product), { strikedPrice: product['striked-price'] });
            delete newDataProduct['striked-price'];
            return newDataProduct;
        });
        // Store JSON data in DynamoDB
        const params = {
            TableName: 'SPOTTER_PRODUCTS',
            Item: {
                id: '1',
                data: jsonData,
            },
        };
        yield docClient.put(params).promise();
        res.json({ message: 'Data stored successfully' });
    }
    catch (error) {
        console.error('Error storing JSON data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.addProductsToDB = addProductsToDB;
// Route handler to retrieve JSON data from DynamoDB
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve JSON data from DynamoDB
        const params = {
            TableName: 'SPOTTER_PRODUCTS',
            Key: {
                id: '1',
            },
        };
        const result = yield docClient.get(params).promise();
        if (!result.Item) {
            return res.status(404).json({ error: 'Data not found' });
        }
        return result.Item.data;
    }
    catch (error) {
        console.error('Error retrieving JSON data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllProducts = getAllProducts;
const getAllProductsWithPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
    const pageSize = parseInt(((_b = req.query.pageSize) === null || _b === void 0 ? void 0 : _b.toString()) || '12');
    try {
        const data = yield (0, exports.getAllProducts)(req, res);
        const paginationData = yield (0, utils_1.getPagination)(data, page, pageSize);
        res.json(paginationData);
    }
    catch (error) {
        console.error('Error retrieving JSON data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllProductsWithPagination = getAllProductsWithPagination;
const searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    //Parse query parameters
    const searchTerm = ((_c = req.query.searchTerm) === null || _c === void 0 ? void 0 : _c.toString()) || '';
    const page = parseInt(((_d = req.query.page) === null || _d === void 0 ? void 0 : _d.toString()) || '1');
    const pageSize = parseInt(((_e = req.query.pageSize) === null || _e === void 0 ? void 0 : _e.toString()) || '12');
    const inputs = ['title', 'vendor'];
    try {
        // Fetch all products
        const data = yield (0, exports.getAllProducts)(req, res);
        const filteredProductsData = yield (0, utils_1.searchData)(data, searchTerm, inputs);
        const paginationData = yield (0, utils_1.getPagination)(filteredProductsData, page, pageSize);
        res.json(paginationData);
    }
    catch (error) {
        console.error('Error retrieving JSON data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.searchProduct = searchProduct;
// Define a default route handler
const enpointError = (req, res) => {
    res.status(404).json({ error: 'Route not found' });
};
exports.enpointError = enpointError;
