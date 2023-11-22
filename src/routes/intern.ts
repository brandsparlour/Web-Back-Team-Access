import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as internController from "../controllers/intern";
import { generateHash } from "../helpers/bcrypt";
import { ICreateInternReq, InternTypes } from "../interfaces/intern";
import { verifyIntern } from "../middlewares/auth";
import { CustomError } from "../middlewares/error";

const router = express.Router();

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_id } = req.headers as any;

    const {
      internship_id,
      link_id,
      referred_by,
      intern_type,
      course,
      year,
      college,
      university,
      photo,
      identity_card,
      full_name,
      mobile_number,
      password,
      email,
      dob,
    } = req.body;

    // validate request body
    if (!company_id || !internship_id || !intern_type || !full_name || !mobile_number || !password) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Company Id, Internship Id, intern_type, full name, mobile number and password are required",
      };

      throw err;
    }

    if (!Object.keys(InternTypes).includes(intern_type)) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid Intern Type. Valid type are ORGANIZER and INFLUENCER",
      };
    }

    const data: ICreateInternReq = {
      company_id,
      internship_id,
      link_id,
      referred_by,
      intern_type,
      course,
      year,
      college,
      university,
      photo,
      identity_card,
      full_name,
      mobile_number,
      password: generateHash(password),
      email,
      dob,
    };

    const result = await internController.registerIntern(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully registered Intern.",
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

    const result = await internController.retrieveInternDetailsByMobileNumber(parseInt(company_id), mobile_number);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched intern details.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/id/:intern_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { intern_id } = req.params;

    if (!intern_id || intern_id === "undefined") {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Intern Id is required",
      };

      throw err;
    }

    const result = await internController.retrieveInternDetailsById(parseInt(intern_id));
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched intern details.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/", verifyIntern, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { intern_id } = req.user;

    if (!intern_id || intern_id === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid User",
      };
    }

    // remove payment status from update object as user cannot directly update this
    const { payment_status, ...updateDetails } = req.body;

    // validate if request body contains anything to update
    if (!Object.keys(updateDetails).length) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Nothing to update.",
      };

      throw err;
    }

    const result = await internController.updateInternDetailsById(parseInt(intern_id), updateDetails);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully updated Intern details",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
