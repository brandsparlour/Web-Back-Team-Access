import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateProductReview, IProductReviewDetails } from "../interfaces/product-review";

export const addProductReview = async (data: ICreateProductReview): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const jobData = {
      product_id: data.product_id,
      customer_id: data.customer_id,
      rating: data.rating,
      review_text: data.review_text,
    };
    const results = await query(connection,"INSERT INTO ProductReviews SET ?", jobData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/product-review/addProductReview => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding product review => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveProductReviews = async (): Promise<Result<IProductReviewDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IProductReviewDetails[] = await query(connection,"SELECT * from ProductReviews");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/product-review/retrieveProductReviews => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving products review => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveProductReviewsByProductId = async (productId:number): Promise<Result<IProductReviewDetails[]>> => {
    const connection: PoolConnection = await getDbConnection();
    try {
      const result: IProductReviewDetails[] = await query(connection,"SELECT * from ProductReviews where product_id = ?",[productId]);
  
      return Result.ok(result);
    } catch (err) {
      logger.error(`at: repositories/product-review/retrieveProductReviewsByProductId => ${err} \n ${JSON.stringify(err)}`);
  
      return Result.error(`Error retrieving products review => ${err}`);
    } finally {
      releaseDbConnection(connection);
    }
  };

export const deleteProductReviewById = async (reviewId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection,"Delete from ProductReviews where review_id = ? ", [reviewId]);

    return Result.ok("Delete product review successfully");
  } catch (err) {
    logger.error(`at: repositories/product-review/deleteProductReviewById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the product review=> ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
