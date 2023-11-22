import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as internshipController from "../controllers/internship";
import { ICreateInternship, IUpdateInternship, InternshipPaymentType } from "../interfaces/internship";
import { Result } from "../interfaces/result";
import { verifyAdmin } from "../middlewares/auth";
import { CustomError } from "../middlewares/error";

const router = express.Router();

router.post("/admin", verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_id, name, description, payment_type, registration_fee } = req.body;

    // validate request body
    if (
      !company_id ||
      !name ||
      !description ||
      !payment_type ||
      (payment_type === InternshipPaymentType.PAID && !registration_fee)
    ) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "company_id, name, description and payment_type are required.",
      };

      throw err;
    }

    if (!Object.keys(InternshipPaymentType).includes(payment_type)) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid payment type.",
      };
    }

    const data: ICreateInternship = {
      company_id,
      name,
      description,
      payment_type,
      registration_fee,
    };

    // controller call to save internship details
    const result: Result = await internshipController.addInternship(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created internship.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_id } = req.headers as any;

    if (!company_id || company_id === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Company Id is required",
      };
    }

    const result = await internshipController.retrieveAllInternshipsInACompany(company_id);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched internships.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:internshipId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { internshipId } = req.params;

    if (!internshipId || internshipId === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Internship id is required.",
      };
    }

    const isInternshipExists = await internshipController.retrieveInternshipDetailsById(parseInt(internshipId));
    if (isInternshipExists.isError()) {
      throw isInternshipExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting internship details.",
      data: isInternshipExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/:internshipId", verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { internshipId } = req.params;

    if (!internshipId || internshipId === "undefined") {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "internship_id is required",
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

    const data: IUpdateInternship = {
      ...req.body,
    };

    const result: Result = await internshipController.updateInternshipById(parseInt(internshipId), data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully updated internship.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
