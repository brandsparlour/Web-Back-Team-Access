import express, { Request, Response, NextFunction } from "express";
import STATUS from "../constants/status-code";

const router = express.Router();

/**
 * @route healthcheck
 * @description
 * - @returns server running confirmation
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // return success response
    res.status(STATUS.OK).json({
      status: STATUS.OK,
      success: true,
      message: "Server is Up!",
      response: {},
    });
  } catch (error) {
    next(error);
  }
});

export default router;
