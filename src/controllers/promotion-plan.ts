import { Result } from "../interfaces/result";
import * as promotionPlanRepo from "../repositories/promotion-plan";
import logger from "../utils/logger";
import { ICreatePromotionPlan, IPromotionPlan } from "../interfaces/promotion-plan";

export const addPromotionPlan = async (data: ICreatePromotionPlan) => {
  try {
    // calling repo function to store data
    const addPromotionPlanResult: Result = await promotionPlanRepo.addPromotionPlan(data);
    // If there is any error then throw error
    if (addPromotionPlanResult.isError()) {
      throw addPromotionPlanResult.error;
    }

    return Result.ok(addPromotionPlanResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrievePromotionPlan = async () => {
    try {
      // To check whether user exists with this userName
      const promotionPlanDetails: Result<IPromotionPlan[] | any> =
        await promotionPlanRepo.retrievePromotionPlan();
  
      if (promotionPlanDetails.isError()) {
        throw promotionPlanDetails.error;
      }
  
      return Result.ok(promotionPlanDetails.data);
    } catch (error) {
      // logging the error
      logger.error(
        `at: "controllers/promotion-plan/retrievePromotionPlan" => ${JSON.stringify(
          error
        )}\n${error}`
      );
  
      // return negative response
      return Result.error("Error retrieving promotion plan");
    }
  };

export const retrievePromotionPlanById = async (id:number) => {
  try {
    // To check whether user exists with this userName
    const jobDetails: Result<IPromotionPlan | any> =
      await promotionPlanRepo.retrievePromotionPlanById(id);

    if (jobDetails.isError()) {
      throw jobDetails.error;
    }

    return Result.ok(jobDetails.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/promotion-plan/retrievePromotionPlanById" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    // return negative response
    return Result.error("Error retrieving promotion plan");
  }
};