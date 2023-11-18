import { ICreateProductBrand, IProductBrandDetails } from "../interfaces/product-brand";
import { Result } from "../interfaces/result";
import * as productBrandRepo from "../repositories/product-brand";
import logger from "../utils/logger";

export const addProductBrand = async (data: ICreateProductBrand) => {
  try {
    // calling repo function to store data
    const addProductBrandResult: Result = await productBrandRepo.addProductBrand(data);
    // If there is any error then throw error
    if (addProductBrandResult.isError()) {
      throw addProductBrandResult.error;
    }

    return Result.ok(addProductBrandResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const retrieveProductBrand = async () => {
  try {
    // To check whether user exists with this userName
    const productBrandDetails: Result<IProductBrandDetails[] | any> =
      await productBrandRepo.retrieveProductBrand();

    if (productBrandDetails.isError()) {
      throw productBrandDetails.error;
    }

    return Result.ok(productBrandDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product-brand/retrieveProductBrand" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error("Error retrieving products brand");
  }
};


export const deleteProductBrandById = async (brandId: number) => {
  try {
    // To check whether user exists with this userName
    const productBrandDetails: Result<IProductBrandDetails[] | any> = await productBrandRepo.deleteProductBrandById(
        brandId,
    );

    if (productBrandDetails.isError()) {
      throw productBrandDetails.error;
    }

    return Result.ok(productBrandDetails.data);
  } catch (error) {
    // logging the error
    logger.error(`at: "controllers/product-brand/deleteProductBrandById" => ${JSON.stringify(error)}\n${error}`);

    // return negative response
    return Result.error(error);
  }
};
