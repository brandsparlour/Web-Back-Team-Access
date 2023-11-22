import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICartDetail, ICreateCart } from "../interfaces/cart";

export const addCart = async (data: ICreateCart): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const results = await query(connection,"INSERT INTO Cart SET ?", data);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/cart/addCart => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding product wishlist => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveCart = async (): Promise<Result<ICartDetail[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: ICartDetail[] = await query(connection,"SELECT * from Cart");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/cart/retrieveCart => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving cart => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrieveCartByCustomerId = async (customerId: number): Promise<Result<ICartDetail[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: ICartDetail[] = await query(connection,"SELECT * from Cart where customer_id = ?", [customerId]);

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/cart/retrieveCartByCustomerId => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving cart => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const deleteCartById = async (cartId: number): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    await query(connection,"Delete from Cart where cart_id = ? ", [cartId]);

    return Result.ok("Delete cart successfully");
  } catch (err) {
    logger.error(`at: repositories/cart/deleteCartById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error while delete the cart=> ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
