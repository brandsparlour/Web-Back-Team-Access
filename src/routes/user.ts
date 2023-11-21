import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as userController from "../controllers/user";
import { generateHash } from "../helpers/bcrypt";
import { Result } from "../interfaces/result";
import { ICreateUser, UserTypes } from "../interfaces/user";
import { CustomError } from "../middlewares/error";

const router = express.Router();

router.post("/admin/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_id, user_type, full_name, mobile_number, email, password, dob } = req.body;

    // validate request body
    if (!company_id || !user_type || !full_name || !mobile_number || !password) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Company Id, User Type, full name, mobile_number and password are required",
      };

      throw err;
    }

    if (!Object.keys(UserTypes).includes(user_type)) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid user type",
      };
    }

    const userDetails: ICreateUser = {
      company_id,
      user_type,
      full_name,
      mobile_number,
      email,
      password: generateHash(password),
      dob,
    };

    const result: Result = await userController.addUser(userDetails);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created user",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_id, mobile_number, password } = req.body;

    if (!company_id || !mobile_number || !password) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Company Id, mobile_number and password are required",
      };

      throw err;
    }

    const result: Result = await userController.loginUser(company_id, mobile_number, password);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully logged in.",
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

    const result: Result = await userController.fetchUserDetailsByMobileNumber(parseInt(company_id), mobile_number);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched user details.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/id/:user_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;

    if (!user_id || user_id === "undefined") {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "user id is required",
      };

      throw err;
    }

    const result: Result = await userController.fetchUserById(parseInt(user_id));
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched user details.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
