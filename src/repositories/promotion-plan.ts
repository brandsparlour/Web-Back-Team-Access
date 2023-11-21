import { Result } from "../interfaces/result";
import logger from "../utils/logger";
import { getDbConnection, query, releaseDbConnection } from "../db_init/db";
import { PoolConnection } from "mysql";
import { ICreatePromotionPlan, IPromotionPlan } from "../interfaces/promotion-plan";

export const addPromotionPlan = async (data: ICreatePromotionPlan): Promise<Result> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const companyData = {
      plan_name: data.plan_name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      billing_cycle: data.billing_cycle,
      features: data.features,
      customization_options: data.customization_options,
      availability: data.availability,
    };
    const [results] = await query(connection, "INSERT INTO PromotionPlans SET ?", companyData);

    return Result.ok(results.insertId);
  } catch (err) {
    logger.error(`at: repositories/promotion-plan/addPromotionPlan => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error adding promotion plan => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrievePromotionPlan = async (): Promise<Result<IPromotionPlan[]>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IPromotionPlan[] = await query(connection, "SELECT * from PromotionPlans");

    return Result.ok(result);
  } catch (err) {
    logger.error(`at: repositories/promotion-plan/retrievePromotionPlan => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving promotion plan => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};

export const retrievePromotionPlanById = async (id: number): Promise<Result<IPromotionPlan>> => {
  const connection: PoolConnection = await getDbConnection();
  try {
    const result: IPromotionPlan[] = await query(connection, "SELECT * from PromotionPlans where plan_id = ?", [id]);

    return Result.ok(result[0]);
  } catch (err) {
    logger.error(`at: repositories/promotion-plan/retrievePromotionPlanById => ${err} \n ${JSON.stringify(err)}`);

    return Result.error(`Error retrieving companies => ${err}`);
  } finally {
    releaseDbConnection(connection);
  }
};
