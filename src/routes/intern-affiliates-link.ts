import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as internAffiliatesLinkController from "../controllers/intern-affiliate-link";
import { ICreateInternAffiliateLink } from "../interfaces/intern-affiliate-link";
import { Result } from "../interfaces/result";
import { verifyEmployee } from "../middlewares/auth";
import { CustomError } from "../middlewares/error";

const router = express.Router();

router.post("/admin", verifyEmployee, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employee_id } = req.user;

    if (!employee_id) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid request",
      };

      throw err;
    }

    const { company_id, job_details, link } = req.body;

    // validate request body
    if (!company_id || !job_details || !link) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "company_id , created_by, job_details and link are required",
      };

      throw err;
    }

    const data: ICreateInternAffiliateLink = {
      company_id,
      created_by: employee_id,
      job_details,
      link,
      is_active: true,
    };

    // controller call to save link details
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

router.get("/employee/:employee_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id || employee_id === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Employee id is required",
      };
    }

    const result = await internAffiliatesLinkController.retrieveAllInternshipAffiliateLinksCreatedByAnEmployee(
      parseInt(employee_id),
    );
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting all intern affiliate links created by an employee",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:link_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { link_id } = req.params;

    if (!link_id || link_id === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Link id is required",
      };
    }

    const isCompanyExists = await internAffiliatesLinkController.retrieveInternAffiliateLinkById(parseInt(link_id));
    if (isCompanyExists.isError()) {
      throw isCompanyExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "retrieved intern affiliate link details",
      data: isCompanyExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:link_id", verifyEmployee, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { link_id } = req.params;

    if (!link_id || link_id === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Link id is required",
      };
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

    const result = await internAffiliatesLinkController.updateInternAffiliateLink(parseInt(link_id), req.body);
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

router.delete("/:link_id", verifyEmployee, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { link_id } = req.params;

    if (!link_id || link_id === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Link id is required",
      };
    }

    const result = await internAffiliatesLinkController.deleteInternAffiliateLinkById(parseInt(link_id));
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
