// Search function with pagination
export const searchData = async (
  data: any,
  searchTerm: string,
  inputs: string[]
): Promise<any> => {
  //Perform search logic
  const filteredResults = data.filter((product: any) =>
    inputs.some((input) =>
      product[input]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  return filteredResults;
};

// Search function with pagination
export const getPagination = async (
  data: any,
  page: number,
  pageSize: number
): Promise<any> => {
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
};

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
