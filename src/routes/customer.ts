import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as customerController from "../controllers/customer";
import { generateHash } from "../helpers/bcrypt";
import { verifyCustomer } from "../middlewares/auth";
import { CustomError } from "../middlewares/error";
import { CustomerTypes, ICreateCustomerReq } from "../interfaces/customer";

const router = express.Router();

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_id } = req.headers as any;

    const { type, profile_image, address, full_name, mobile_number, password, email, dob } = req.body;

    // validate request body
    if (!company_id || !type || !full_name || !mobile_number || !password) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Company Id, type, full name, mobile number and password are required",
      };

      throw err;
    }

    if (!Object.values(CustomerTypes).includes(type)) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage:
          "Invalid Type. Valid type are event sponsorship(promote my business), product purchase and plan purchase",
      };
    }

    const data: ICreateCustomerReq = {
      company_id,
      type,
      profile_image,
      address,
      full_name,
      mobile_number,

      password: generateHash(password),
      email,
      dob: new Date(dob),
    };
    const result = await customerController.registerCustomer(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully registered Customer.",
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

    const result = await customerController.retrieveCustomerDetailsByMobileNumber(parseInt(company_id), mobile_number);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched customer details.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/id/:customer_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.params;

    if (!customer_id || customer_id === "undefined") {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Customer Id is required",
      };

      throw err;
    }

    const result = await customerController.retrieveCustomerDetailsById(parseInt(customer_id));
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched customer details.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/", verifyCustomer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.user;

    if (!customer_id || customer_id === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid User",
      };
    }

    // remove payment status from update object as user cannot directly update this
    const { ...updateDetails } = req.body;

    // validate if request body contains anything to update
    if (!Object.keys(updateDetails).length) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Nothing to update.",
      };

      throw err;
    }

    const result = await customerController.updateCustomerById(parseInt(customer_id), updateDetails);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully updated Customer details",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
