import { ICreateProductCategory, IProductCategoryDetails } from "../interfaces/product-category";
import { Result } from "../interfaces/result";
import * as productCategoryRepo from "../repositories/product-category";
import logger from "../utils/logger";

export const addProductReview = async (data: ICreateProductCategory) => {
  try {
    // calling repo function to store data
    const addProductCategoryResult: Result = await productCategoryRepo.addProductCategory(data);
    // If there is any error then throw error
    if (addProductCategoryResult.isError()) {
      throw addProductCategoryResult.error;
    }

    return Result.ok(addProductCategoryResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveProductCategories = async () => {
  try {
    // To check whether user exists with this userName
    const productCategoryDetails: Result<IProductCategoryDetails[] | any> =
      await productCategoryRepo.retrieveProductCategory();

    if (productCategoryDetails.isError()) {
      throw productCategoryDetails.error;
    }

    return Result.ok(productCategoryDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product-category/retrieveProductCategories" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving products category");
  }
};


export const deleteProductCategoryById = async (categoryId: number) => {
  try {
    // To check whether user exists with this userName
    const productReviewDetails: Result = await productCategoryRepo.deleteProductCategoryById(
        categoryId,
    );

    if (productReviewDetails.isError()) {
      throw productReviewDetails.error;
    }

    return Result.ok(productReviewDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product-category/deleteProductCategoryById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
