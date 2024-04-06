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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = exports.searchData = void 0;
// Search function with pagination
const searchData = (data, searchTerm, inputs) => __awaiter(void 0, void 0, void 0, function* () {
    //Perform search logic
    const filteredResults = data.filter((product) => inputs.some((input) => { var _a; return (_a = product[input]) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase()); }));
    return filteredResults;
});
exports.searchData = searchData;
// Search function with pagination
const getPagination = (data, page, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    // Paginate filtered products
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const paginatedResults = data.slice(startIndex, endIndex);
    return {
        page,
        pageSize,
        totalResults: data.length,
        totalPages: Math.ceil(data.length / pageSize),
        results: paginatedResults,
    };
});
exports.getPagination = getPagination;
// Function to generate dynamic training data from product dataset
// export const generateTrainingData = (
//   data: any,
//   inputs: string[]
// ): Promise<{input: string; output: string}[]> => {
//   try {
//     // Extract relevant data from products and format into training data
//     const trainingData = data.map((item: any) => ({
//       input: `${item.title.toLowerCase()} ${item.price.toLowerCase()} ${item.vendor.toLowerCase()}`,
//       output: 'relevant', // Assuming all products are relevant
//     }));
//     return trainingData;
//   } catch (error) {
//     throw new Error('Failed to generate training data:');
//   }
// };
