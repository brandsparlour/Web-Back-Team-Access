// Error middleware for express

// Interface for Error response
interface ErrorResponse {
  status: number;
  success: boolean;
  message: string;
  err_stack?: object;
}

export interface CustomError {
  statusCode?: number;
  customMessage: string;
}

import { NextFunction, Request, Response } from "express";

// Default function is exported to be a middleware and handle all errors
export default (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  // If the err object has a statusCode field, use that or default error code is 500
  // If the err object has a customMessage field, use that or default message is "Please contact the ADMIN"
  // Storing error response in a constant
  const errorResponse: ErrorResponse = {
    status: err.statusCode ? err.statusCode : 500,
    success: false,
    message: err.customMessage ? err.customMessage : "Please contact the ADMIN",
  };

  // If env is dev, send the err stack
  if (process.env.NODE_ENV !== "production") {
    errorResponse.err_stack = err;
  }

  // Send the response to the consumer
  res.status(errorResponse.status).send(errorResponse);
};
