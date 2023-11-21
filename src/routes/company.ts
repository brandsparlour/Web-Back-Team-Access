import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as companyController from "../controllers/company";
import { ICompanyDetails, ICreateCompany, IUpdateCompany } from "../interfaces/company";
import { Result } from "../interfaces/result";
import { CustomError } from "../middlewares/error";
import { verifyAdmin } from "../middlewares/auth";

const router = express.Router();

router.post("/admin", verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_name, address, contact, logo, privacy_policy, terms_and_conditions } = req.body;

    // validate request body
    if (!company_name || !address || !contact || !logo) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "company_name , address, contact, created_at are required",
      };

      throw err;
    }

    const data: ICreateCompany = {
      company_name,
      address,
      contact,
      logo,
      privacy_policy,
      terms_and_conditions,
    };

    // controller call to save user details
    const result: Result = await companyController.addCompany(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created company",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result<ICompanyDetails[]> = await companyController.retrieveAllCompanies();
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched companies.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:companyId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params;

    if (!companyId || companyId === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Company id is required",
      };
    }

    const isCompanyExists: Result<ICompanyDetails> = await companyController.retrieveCompanyDetailsById(
      parseInt(companyId),
    );
    if (isCompanyExists.isError()) {
      throw isCompanyExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting company details",
      data: isCompanyExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/:companyId", verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params;

    if (!companyId || companyId === "undefined") {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "company_id is required",
      };

      throw err;
    }

    // validate if request body contains anything to update
    if (!Object.keys(req.body).length) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Nothing to update.",
      };

      throw err;
    }

    const data: IUpdateCompany = {
      ...req.body,
    };

    const result: Result = await companyController.updateCompanyById(parseInt(companyId), data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully updated company",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
