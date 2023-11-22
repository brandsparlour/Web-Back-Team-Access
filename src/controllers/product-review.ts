import { ICreateProductReview, IProductReviewDetails } from "../interfaces/product-review";
import { Result } from "../interfaces/result";
import * as productReviewRepo from "../repositories/product-review";
import logger from "../utils/logger";

export const addProductReview = async (data: ICreateProductReview) => {
  try {
    // calling repo function to store data
    const addProductReviewResult: Result = await productReviewRepo.addProductReview(data);
    // If there is any error then throw error
    if (addProductReviewResult.isError()) {
      throw addProductReviewResult.error;
    }

    return Result.ok(addProductReviewResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveProductReviews = async () => {
  try {
    // To check whether user exists with this userName
    const productReviewDetails: Result<IProductReviewDetails[] | any> =
      await productReviewRepo.retrieveProductReviews();

    if (productReviewDetails.isError()) {
      throw productReviewDetails.error;
    }

    return Result.ok(productReviewDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product-review/retrieveProductReviews" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving products review");
  }
};

export const retrieveProductReviewsByProductId = async (productId: number) => {
  try {
    // To check whether user exists with this userName
    const productReviewDetails: Result<IProductReviewDetails[] | any> =
      await productReviewRepo.retrieveProductReviewsByProductId(productId);

    if (productReviewDetails.isError()) {
      throw productReviewDetails.error;
    }

    return Result.ok(productReviewDetails.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/product-review/retrieveProductReviewsByProductId" => ${JSON.stringify(error)}\n${error}`,
    );

    // return negative response
    return Result.error("Error retrieving products review");
  }
};

export const deleteProductReviewById = async (reviewId: number) => {
  try {
    // To check whether user exists with this userName
    const productReviewDetails: Result = await productReviewRepo.deleteProductReviewById(
      reviewId,
    );

    if (productReviewDetails.isError()) {
      throw productReviewDetails.error;
    }

    return Result.ok(productReviewDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product-review/deleteProductReviewById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
