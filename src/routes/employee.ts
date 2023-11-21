import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as employeeController from "../controllers/employee";
import { generateHash } from "../helpers/bcrypt";
import { ICreateEmployeeReq } from "../interfaces/employee";
import { verifyAdmin } from "../middlewares/auth";
import { CustomError } from "../middlewares/error";

const router = express.Router();

router.post("/admin/register", verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      company_id,
      role_id,
      full_name,
      mobile_number,
      email,
      password,
      dob,
      profile_image,
      address,
      reporting_to,
      locations_responsible,
    } = req.body;

    // validate request body
    if (!company_id || !role_id || !full_name || !mobile_number || !password) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Company Id, role id, user type, full name, mobile number and password are required",
      };

      throw err;
    }

    const data: ICreateEmployeeReq = {
      company_id,
      role_id,
      full_name,
      mobile_number,
      email,
      password: generateHash(password),
      dob,
      profile_image,
      address,
      reporting_to,
      locations_responsible,
    };

    const result = await employeeController.registerEmployee(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully registered Employee.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/mobileNumber/:mobile_number", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobile_number } = req.params;

    const { company_id } = req.headers as any;

    if (!company_id || !mobile_number || mobile_number === "undefined") {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Mobile number and company id are required",
      };

      throw err;
    }

    const result = await employeeController.fetchEmployeeDetailsByMobileNumber(parseInt(company_id), mobile_number);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched employee details.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/id/:employee_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id || employee_id === "undefined") {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Employee Id is required",
      };

      throw err;
    }

    const result = await employeeController.fetchEmployeeDetailsById(parseInt(employee_id));
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched employee details.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
