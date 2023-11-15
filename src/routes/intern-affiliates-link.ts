import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as internAffiliatesLinkController from "../controllers/intern-affiliate-link";
import { Result } from "../interfaces/result";
import {
  ICreateInternAffiliateLink,
  IInternAffiliateLinkDetails,
  IUpdateInternAffiliateLink,
} from "../interfaces/intern-affiliate-link";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_id, created_by, job_details, link, is_active, created_at, updated_at } = req.body;

    // validate request body
    if (!company_id || !created_by || !job_details || !link) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `company_id , created_by, job_details, link are required`,
      };

      throw err;
    }

    const data: ICreateInternAffiliateLink = {
      company_id,
      created_by,
      job_details,
      link,
      is_active,
      created_at,
      updated_at,
    };

    // controller call to save user details
    const result: Result = await internAffiliatesLinkController.addInternAffiliateLink(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created internAffiliateLink",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCompanyExists: Result<IInternAffiliateLinkDetails[]> =
      await internAffiliatesLinkController.retrieveInternAffiliateLinkDetails();
    if (isCompanyExists.isError()) {
      throw isCompanyExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting intern details",
      data: isCompanyExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCompanyExists: Result<IInternAffiliateLinkDetails> =
      await internAffiliatesLinkController.retrieveInternAffiliateLinkById(parseInt(req.params.id));
    if (isCompanyExists.isError()) {
      throw isCompanyExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting intern details",
      data: isCompanyExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { job_details, link, company_id, link_id } = req.body;

    // validate request body
    if (!company_id || !job_details || !link_id || !link) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `company_id , link_id, job_details, link are required`,
      };

      throw err;
    }

    const data: IUpdateInternAffiliateLink = {
      job_details,
      link,
      company_id,
      link_id,
    };

    // controller call to save user details
    const result: Result = await internAffiliatesLinkController.updateInternAffiliateLink(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully updated internAffiliateLink",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCompanyExists: Result = await internAffiliatesLinkController.deleteInternAffiliateLinkById(parseInt(req.params.id));
    if (isCompanyExists.isError()) {
      throw isCompanyExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isCompanyExists.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
