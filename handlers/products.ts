import {Request, Response} from 'express';
import axios from 'axios';
import AWS from 'aws-sdk';
import {searchData, getPagination} from '../utils/utils';
require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Create a DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// Define the URL from which to fetch JSON data
const jsonDataUrl =
  'https://spotter-interview-files.s3.amazonaws.com/take-home-data-facet.json';

// Route handler to store JSON data in DynamoDB
export const addProductsToDB = async (req: Request, res: Response) => {
  try {
    // Fetch JSON data from the specified URL
    const response = await axios.get(jsonDataUrl);
    const jsonData = response.data.map((product: any) => {
      const newDataProduct = {
        ...product,
        strikedPrice: product['striked-price'],
      };
      delete newDataProduct['striked-price'];
      return newDataProduct;
    });

    // Store JSON data in DynamoDB
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'SPOTTER_PRODUCTS',
      Item: {
        id: '1',
        data: jsonData,
      },
    };

    await docClient.put(params).promise();

    res.json({message: 'Data stored successfully'});
  } catch (error) {
    console.error('Error storing JSON data:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

// Route handler to retrieve JSON data from DynamoDB
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Retrieve JSON data from DynamoDB
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: 'SPOTTER_PRODUCTS',
      Key: {
        id: '1',
      },
    };
    const result = await docClient.get(params).promise();
    if (!result.Item) {
      return res.status(404).json({error: 'Data not found'});
    }
    return result.Item.data;
  } catch (error) {
    console.error('Error retrieving JSON data:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

export const getAllProductsWithPagination = async (
  req: Request,
  res: Response
) => {
  const page: number = parseInt(req.query.page?.toString() || '1');
  const pageSize: number = parseInt(req.query.pageSize?.toString() || '12');
  try {
    const data = await getAllProducts(req, res);
    const paginationData = await getPagination(data, page, pageSize);
    res.json(paginationData);
  } catch (error) {
    console.error('Error retrieving JSON data:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  //Parse query parameters
  const searchTerm: string = req.query.searchTerm?.toString() || '';
  const page: number = parseInt(req.query.page?.toString() || '1');
  const pageSize: number = parseInt(req.query.pageSize?.toString() || '12');
  const inputs: string[] = ['title', 'vendor'];
  try {
    // Fetch all products
    const data = await getAllProducts(req, res);
    const filteredProductsData = await searchData(data, searchTerm, inputs);
    const paginationData = await getPagination(
      filteredProductsData,
      page,
      pageSize
    );
    res.json(paginationData);
  } catch (error) {
    console.error('Error retrieving JSON data:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

// Define a default route handler
export const enpointError = (req: Request, res: Response) => {
  res.status(404).json({error: 'Route not found'});
};
