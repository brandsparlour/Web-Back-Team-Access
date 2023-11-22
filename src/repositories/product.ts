import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateProduct, IProductDetails } from "../interfaces/product";

export const addProduct = async (data: ICreateProduct): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const jobData = {
      product_name: data.product_name,
      description: data.description,
      price: data.price,
      stock_quantity: data.stock_quantity,
      category: data.category,
      brand: data.brand,
      product_images: data.product_images,
      product_SKU: data.product_SKU,
      average_rating: data.average_rating,
      number_of_reviews: data.number_of_reviews,
      material: data.material,
      dimensions: data.dimensions,
      weight: data.weight,
      color: data.color,
      size: data.size,
    };
    const results = await query(connection,"INSERT INTO Products SET ?", jobData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/product/addProduct => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding product => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveProducts = async (): Promise<Result<IProductDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IProductDetails[] = await query(connection,"SELECT * from Products");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/product/retrieveProducts => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving products => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};


export const retrieveProductById = async (productId:number): Promise<Result<IProductDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IProductDetails = await query(connection,"SELECT * from Products where product_id = ?",[productId]);

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/product/retrieveProductById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving products => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};


export const deleteProductById = async (productId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection,"Delete from Products where product_id = ? ", [productId]);

    return Result.ok("Delete product successfully");
  } catch (err) {
    logger.error(`at: repositories/product/deleteProductById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the product => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
