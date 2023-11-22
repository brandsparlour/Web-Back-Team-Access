import { PoolConnection } from "mysql";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { ICreatePaymentOrder, IPaymentOrderDetails, IUpdatePaymentOrder } from "../interfaces/payment-order";
import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import STATUS from "../constants/status-code";

export const addPaymentOrder = async (data: ICreatePaymentOrder): Promise<Result<{ order_id: number }>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "INSERT INTO PaymentOrders SET ?", data);

    return Result.ok(result.insertId);
  } catch (err) {
    logger.error(`at: repositories/payment-order/addPaymentOrder => ${JSON.stringify(err)} \n  ${err} `);

    return Result.error(`Error adding PaymentOrder => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrievePaymentOrderDetailsById = async (
  payment_order_id: number,
): Promise<Result<IPaymentOrderDetails>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result = await query(connection, "SELECT * from PaymentOrders where order_id = ?", [payment_order_id]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/payment-order/retrievePaymentOrderDetailsById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving payment order details => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const updatePaymentOrderById = async (order_id: number, data: IUpdatePaymentOrder): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();

  try {
    const updateSql =
      "UPDATE PaymentOrders SET " +
      Object.keys(data)
        .map((key) => ` ${key} = ? `)
        .join(",") +
      " WHERE order_id = ?";

    const result = await query(connection, updateSql, [...Object.values(data), order_id]);

    if (!result.affectedRows) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "payment order not found.",
      };
    }

    return Result.ok("Updated payment order detail");
  } catch (err) {
    logger.error(`at: repositories/payment-order/updatePaymentOrderById => ${JSON.stringify(err)} \n ${err}`);

    return Result.error("Error updating company detail");
  } finally {
    releaseDbConnection(connection);
  }
};
