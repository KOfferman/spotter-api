"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules
const express_1 = __importDefault(require("express"));
const products_1 = __importDefault(require("./enpoints/products"));
require('dotenv').config();
// Create an Express application
const app = (0, express_1.default)();
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
app.use(products_1.default);
// Start the server and listen on a ports
const port = 443;
app.listen(port, () => {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
});
