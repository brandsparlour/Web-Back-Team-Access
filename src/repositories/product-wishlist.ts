import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreateProductWishList, IProductWishList } from "../interfaces/product-wishlist";

export const addProductWishlist = async (data: ICreateProductWishList): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    
    const results = await query(connection,"INSERT INTO ProductWishList SET ?", data);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/product-wishlist/addProductWishlist => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding product wishlist => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveProductWishlist = async (): Promise<Result<IProductWishList[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IProductWishList[] = await query(connection,"SELECT * from ProductWishList");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/product-wishlist/retrieveProductWishlist => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving products wishlist => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteProductWishlistById = async (wishlistId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection,"Delete from ProductWishList where wishlist_id = ? ", [wishlistId]);

    return Result.ok("Delete product wishlist successfully");
  } catch (err) {
    logger.error(`at: repositories/product-wishlist/deleteProductWishlistById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the product wishlist=> ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
