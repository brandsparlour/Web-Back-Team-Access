import { ICartDetail, ICreateCart } from "../interfaces/cart";
import { Result } from "../interfaces/result";
import * as cartRepo from "../repositories/cart";
import logger from "../utils/logger";

export const addCart = async (data: ICreateCart) => {
  try {
    // calling repo function to store data
    const addCartResult: Result = await cartRepo.addCart(data);
    // If there is any error then throw error
    if (addCartResult.isError()) {
      throw addCartResult.error;
    }

    return Result.ok(addCartResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveCart = async () => {
  try {
    // To check whether user exists with this userName
    const cartDetails: Result<ICartDetail[] | any> = await cartRepo.retrieveCart();

    if (cartDetails.isError()) {
      throw cartDetails.error;
    }

    return Result.ok(cartDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/cart/retrieveCart" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving cart");
  }
};

export const retrieveCartByCustomerId = async (customerId: number) => {
  try {
    // To check whether user exists with this userName
    const cartDetails: Result<ICartDetail[] | any> = await cartRepo.retrieveCartByCustomerId(customerId);

    if (cartDetails.isError()) {
      throw cartDetails.error;
    }

    return Result.ok(cartDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/cart/retrieveCartByCustomerId" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving cart");
  }
};
export const deleteCartById = async (cartId: number) => {
  try {
    // To check whether user exists with this userName
    const cartDetails: Result = await cartRepo.deleteCartById(cartId);

    if (cartDetails.isError()) {
      throw cartDetails.error;
    }

    return Result.ok(cartDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/cart/deleteCartById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
