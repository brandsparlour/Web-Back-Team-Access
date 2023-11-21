import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateProductBrand, IProductBrandDetails } from "../interfaces/product-brand";

export const addProductBrand = async (data: ICreateProductBrand): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    
    const results = await query(connection,"INSERT INTO ProductBrands SET ?", data);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/product-brand/addProductBrand => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding product brand => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveProductBrand = async (): Promise<Result<IProductBrandDetails[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IProductBrandDetails[] = await query(connection,"SELECT * from ProductBrands");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/product-brand/retrieveProductBrand => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving products brand => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteProductBrandById = async (brandId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection,"Delete from ProductBrands where brand_id = ? ", [brandId]);

    return Result.ok("Delete product brand successfully");
  } catch (err) {
    logger.error(`at: repositories/product-brand/deleteProductBrandById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the product brand=> ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
