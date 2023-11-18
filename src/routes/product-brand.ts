import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as productBrandController from "../controllers/product-brand";
import { Result } from "../interfaces/result";
import { ICreateProductBrand, IProductBrandDetails } from "../interfaces/product-brand";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { brand_name, description, brand_logo, brand_website } = req.body;

    // validate request body
    if (!brand_name ) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `brand_name  are required`,
      };

      throw err;
    }

    const data: ICreateProductBrand = {
        brand_name, description, brand_logo, brand_website 
    };

    // controller call to save user details
    const result: Result = await productBrandController.addProductBrand(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created product brand",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductBrandExists: Result<IProductBrandDetails[]> =
      await productBrandController.retrieveProductBrand();
    if (isProductBrandExists.isError()) {
      throw isProductBrandExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting product brand details",
      data: isProductBrandExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:brandId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductBrandExists: Result<IProductBrandDetails[]> =
      await productBrandController.deleteProductBrandById(parseInt(req.params.brandId));
    if (isProductBrandExists.isError()) {
      throw isProductBrandExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isProductBrandExists.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
