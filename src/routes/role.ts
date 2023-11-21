import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as roleController from "../controllers/role";
import { Result } from "../interfaces/result";
import { IRoleDetails } from "../interfaces/role";
import { CustomError } from "../middlewares/error";
import { verifyAdmin } from "../middlewares/auth";

const router = express.Router();

router.post("/admin", verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { designation, company_id } = req.body;

    // validate request body
    if (!designation || !company_id) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "designation and company_id are required",
      };

      throw err;
    }

    const result: Result = await roleController.addRole({ designation, company_id });
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,

      message: "Successfully created role",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all/:company_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { company_id } = req.params;

    if (!company_id || company_id === "undefined") {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "company_id is required.",
      };

      throw err;
    }

    const result: Result<IRoleDetails[]> = await roleController.retrieveAllRoles(parseInt(company_id));
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched all roles.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:roleId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roleId } = req.params;

    if (!roleId || roleId === "undefined") {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "role id is required",
      };
    }

    const roleDetails: Result<IRoleDetails> = await roleController.retrieveRoleDetailsById(parseInt(roleId));
    if (roleDetails.isError()) {
      throw roleDetails.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully fetched role details",
      data: roleDetails.data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/:role_id", verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_id } = req.params;
    const { designation } = req.body;

    if (!designation || !role_id || role_id === "undefined") {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "role id and designation are required.",
      };

      throw err;
    }

    const result: Result = await roleController.updateRoleById(parseInt(role_id), { designation });
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully updated role",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
