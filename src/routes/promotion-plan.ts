import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as promotionPlanController from "../controllers/promotion-plan";
import { Result } from "../interfaces/result";
import { ICreatePromotionPlan, IPromotionPlan } from "../interfaces/promotion-plan";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {  plan_name,
        description,
        price,
        currency,
        billing_cycle,
        features,
        customization_options,
        availability } = req.body;

    // validate request body
    if (!plan_name || !description || !price || !billing_cycle) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `plan_name , description, price, billing_cycle are required`,
      };

      throw err;
    }

    const data: ICreatePromotionPlan = {
        plan_name,
        description,
        price,
        currency,
        billing_cycle,
        features,
        customization_options,
        availability
    };

    // controller call to save user details
    const result: Result = await promotionPlanController.addPromotionPlan(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created promotion plan",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result<IPromotionPlan[]> = await promotionPlanController.retrievePromotionPlan();
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting promotion plan details",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result<IPromotionPlan> = await promotionPlanController.retrievePromotionPlanById(parseInt(req.params.id));
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting promotion plan details",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
