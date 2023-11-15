import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as companyController from "../controllers/company";
import { Result } from "../interfaces/result";
import { ICreateCompany, ICompanyDetails, IUpdateCompany } from "../interfaces/company";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_name, address, contact, created_at, updated_at } = req.body;

    // validate request body
    if (!company_name || !address || !contact || !created_at) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `company_name , address, contact, created_at are required`,
      };

      throw err;
    }

    const data: ICreateCompany = {
      company_name,
      address,
      contact,
      created_at,
      updated_at,
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

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCompanyExists: Result<ICompanyDetails[]> = await companyController.retrieveCompanyDetails();
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

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCompanyExists: Result<ICompanyDetails> = await companyController.retrieveCompanyDetailsById(parseInt(req.params.id));
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

router.put("/", async (req: Request, res: Response, next: NextFunction) => { try {
  const { company_name, address, contact, company_id } = req.body;

  // validate request body
  if (!company_name || !address || !contact || !company_id) {
    // Throw an error if any parameter is not provided
    const err: CustomError = {
      statusCode: STATUS.BAD_REQUEST,
      customMessage: `company_name , address, contact, company_id are required`,
    };

    throw err;
  }

  const data: IUpdateCompany = {
    company_name,
    address,
    contact,
    company_id
  };

  // controller call to save user details
  const result: Result = await companyController.updateCompanyById(data);
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
