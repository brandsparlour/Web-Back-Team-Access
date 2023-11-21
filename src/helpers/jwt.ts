import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const JWT_PRIVATE_SECRET = process.env.WEB_BACK_TEAM_ACCESS_JWT_PRIVATE_SECRET!;

export const generateJWTToken = (details: any, validUpto = "24h", secretKey = JWT_PRIVATE_SECRET) => {
  return jwt.sign(details, secretKey, { expiresIn: validUpto });
};

export const verifyJWTToken = (token: string, secretKey = JWT_PRIVATE_SECRET) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return false;
  }
};
