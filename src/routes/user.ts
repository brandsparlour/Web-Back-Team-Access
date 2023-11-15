import express, { Request, Response, NextFunction } from "express";
import { ICreateUser, IStoreUserResult, IStoredUser } from "../interfaces/user";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as userController from "../controllers/user";
import { Result } from "../interfaces/result";
import { hashString, validateHashedString } from "../helpers/bcrypt";
import { generateToken } from "../helpers/jwt";

const router = express.Router();

router.post("/sign-up", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      company_id,
      user_type,
      role,
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
    if (!full_name || !password || !user_type || !role || !company_id) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `full name , password, user type , role and company id are required`,
      };

      throw err;
    }

    const data: ICreateUser = {
      full_name,
      password: hashString(password),
      company_id,
      user_type,
      role,
      mobile_number,
      email,
      dob,
      profile_image,
      address,
      reporting_to,
      locations_responsible,
    };

    // controller call to save user details
    const result: Result<IStoreUserResult> = await userController.addUser(data);
    if (result.isError()) {
      throw result.error;
    }

    // generate jwt token
    const token = generateToken({ email: email, user_id: result.data, company_id: company_id,user_type:user_type, role: role });


    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully registered user",
      userId: result.data?.id,
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/sign-in", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobileNumber, password } = req.body;

    // validate request body
    if (!mobileNumber || !password) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `mobileNumber and password are required`,
      };

      throw err;
    }

    // check if the user exists with the userName
    const isUserExists: Result<IStoredUser> = await userController.fetchUserDetails(mobileNumber);
    if (isUserExists.isError()) {
      throw isUserExists.error;
    }

    // validate password
    const isPasswordValid: boolean = await validateHashedString(password, isUserExists.data?.password!);

    if (!isPasswordValid) {
      // throw an error if entered password is invalid
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid password",
      };
      throw err;
    }

    // generate token
    const token = generateToken({email: isUserExists.data?.email, user_id: isUserExists.data?.user_id,company_id: isUserExists.data?.company_id, user_type: isUserExists.data?.user_type, role: isUserExists.data?.role});


    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully logged in",
      token,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
