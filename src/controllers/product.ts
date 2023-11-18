import { Result } from "../interfaces/result";
import * as productRepo from "../repositories/product";
import logger from "../utils/logger";
import { ICreateProduct, IProductDetails } from "../interfaces/product";

export const addProduct = async (data: ICreateProduct) => {
  try {
    // calling repo function to store data
    const addProductResult: Result = await productRepo.addProduct(data);
    // If there is any error then throw error
    if (addProductResult.isError()) {
      throw addProductResult.error;
    }

    return Result.ok(addProductResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveProducts = async () => {
  try {
    // To check whether user exists with this userName
    const productDetails: Result<IProductDetails[] | any> = await productRepo.retrieveProducts();

    if (productDetails.isError()) {
      throw productDetails.error;
    }

    return Result.ok(productDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product/retrieveProducts" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving products");
  }
};


export const deleteProductById = async (productId: number ) => {
  try {
    // To check whether user exists with this userName
    const productDetails: Result<IProductDetails[] | any> = await productRepo.deleteProductById(productId);

    if (productDetails.isError()) {
      throw productDetails.error;
    }

    return Result.ok(productDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product/deleteProductById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
