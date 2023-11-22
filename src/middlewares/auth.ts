import dotenv from "dotenv";
dotenv.config();

import { Result } from "../interfaces/result";

import { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import { verifyJWTToken } from "../helpers/jwt";
import { IUserDetails, UserTypes } from "../interfaces/user";

export const validateJWTToken = (req: Request): Result => {
  const bearerHeader = req.header("Authorization");
  if (!bearerHeader) {
    return Result.error({
      statusCode: STATUS.UNAUTHORIZED,
      customMessage: "Access Denied. No token provided.",
    });
  }

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];

  if (!token) {
    return Result.error({
      statusCode: STATUS.UNAUTHORIZED,
      customMessage: "Access Denied. Invalid bearer token provided.",
    });
  }

  const decodedToken = verifyJWTToken(token);

  if (!decodedToken) {
    return Result.error({
      statusCode: STATUS.FORBIDDEN,
      customMessage: "Invalid/Expired token. Please login to continue.",
    });
  }

  return Result.ok(decodedToken);
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const tokenValidationResult = validateJWTToken(req);

  if (tokenValidationResult.isError()) {
    return next(tokenValidationResult.error);
  }

  const decodedToken = tokenValidationResult.data as IUserDetails;

  if (decodedToken.user_type !== UserTypes.ADMIN) {
    return next({
      statusCode: STATUS.UNAUTHORIZED,
      customMessage: "Oops! Access Denied. It seems you need ADMIN privileges to perform this action.",
    });
  }

  req.user = { ...req.user, ...decodedToken };

  next();
};

export const verifyEmployee = (req: Request, res: Response, next: NextFunction) => {
  const tokenValidationResult = validateJWTToken(req);

  if (tokenValidationResult.isError()) {
    return next(tokenValidationResult.error);
  }

  const decodedToken = tokenValidationResult.data as IUserDetails;

  if (![UserTypes.ADMIN, UserTypes.EMPLOYEE].includes(decodedToken.user_type)) {
    return next({
      statusCode: STATUS.UNAUTHORIZED,
      customMessage: "Oops! Access Denied. It seems you need ADMIN or Employee privileges to perform this action.",
    });
  }

  req.user = { ...req.user, ...decodedToken };

  next();
};

export const verifyIntern = (req: Request, res: Response, next: NextFunction) => {
  const tokenValidationResult = validateJWTToken(req);

  if (tokenValidationResult.isError()) {
    return next(tokenValidationResult.error);
  }

  const decodedToken = tokenValidationResult.data as IUserDetails;

  if (decodedToken.user_type !== UserTypes.INTERN) {
    return next({
      statusCode: STATUS.UNAUTHORIZED,
      customMessage: "Oops! Access Denied. It seems you need INTERN privileges to perform this action.",
    });
  }

  req.user = { ...req.user, ...decodedToken };

  next();
};
