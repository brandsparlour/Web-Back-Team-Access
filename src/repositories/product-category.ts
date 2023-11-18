import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateProductCategory, IProductCategoryDetails } from "../interfaces/product-category";

export const addProductCategory = async (data: ICreateProductCategory): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const jobData = {
      category_name: data.category_name,
      parent_category: data.parent_category,
      description: data.description,
    };
    const [results] = await query("INSERT INTO ProductCategories SET ?", jobData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/product-category/addProductCategory => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding product category => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveProductCategory = async (): Promise<Result<IProductCategoryDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IProductCategoryDetails[] = await query("SELECT * from ProductCategories");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/product-category/retrieveProductCategory => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving products category => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteProductCategoryById = async (categoryId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query("Delete from ProductCategories where category_id = ? ", [categoryId]);

    return Result.ok("Delete product category successfully");
  } catch (err) {
    logger.error(`at: repositories/product-category/deleteProductCategoryById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the product category=> ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
