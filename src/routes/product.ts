import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as productController from "../controllers/product";
import { Result } from "../interfaces/result";
import { ICreateProduct, IProductDetails } from "../interfaces/product";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      product_name,
      description,
      price,
      stock_quantity,
      category,
      brand,
      product_images,
      product_SKU,
      average_rating,
      number_of_reviews,
      material,
      dimensions,
      weight,
      color,
      size,
    } = req.body;

    // validate request body
    if (!product_name || !price || !stock_quantity || !category || !brand) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `product_name , price, stock_quantity, category and brand are required`,
      };

      throw err;
    }

    const data: ICreateProduct = {
        product_name,
        description,
        price,
        stock_quantity,
        category,
        brand,
        product_images,
        product_SKU,
        average_rating,
        number_of_reviews,
        material,
        dimensions,
        weight,
        color,
        size,
    };

    // controller call to save user details
    const result: Result = await productController.addProduct(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created product",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductExists: Result<IProductDetails[]> = await productController.retrieveProducts();
    if (isProductExists.isError()) {
      throw isProductExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting product details",
      data: isProductExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:productId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductExists: Result<IProductDetails[]> = await productController.deleteProductById(
      parseInt(req.params.productId)
    );
    if (isProductExists.isError()) {
      throw isProductExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isProductExists.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
