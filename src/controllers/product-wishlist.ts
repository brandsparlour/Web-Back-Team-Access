
import { ICreateProductWishList, IProductWishList } from "../interfaces/product-wishlist";
import { Result } from "../interfaces/result";
import * as productWishlistRepo from "../repositories/product-wishlist";
import logger from "../utils/logger";

export const addProductWishlist = async (data: ICreateProductWishList) => {
  try {
    // calling repo function to store data
    const addProductWishlistResult: Result = await productWishlistRepo.addProductWishlist(data);
    // If there is any error then throw error
    if (addProductWishlistResult.isError()) {
      throw addProductWishlistResult.error;
    }

    return Result.ok(addProductWishlistResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveProductWishlist = async () => {
  try {
    // To check whether user exists with this userName
    const productWishlistDetails: Result<IProductWishList[] | any> =
      await productWishlistRepo.retrieveProductWishlist();

    if (productWishlistDetails.isError()) {
      throw productWishlistDetails.error;
    }

    return Result.ok(productWishlistDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product-wishlist/retrieveProductWishlist" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving products wishlist");
  }
};


export const deleteProductWishlistById = async (wishlistId: number) => {
  try {
    // To check whether user exists with this userName
    const productWishlistDetails: Result = await productWishlistRepo.deleteProductWishlistById(
        wishlistId,
    );

    if (productWishlistDetails.isError()) {
      throw productWishlistDetails.error;
    }

    return Result.ok(productWishlistDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product-wishlist/deleteProductWishlistById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
