import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as productWishlistController from "../controllers/product-wishlist";
import { Result } from "../interfaces/result";
import { ICreateProductWishList, IProductWishList } from "../interfaces/product-wishlist";


const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id, products } = req.body;

    // validate request body
    if (!customer_id ) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `customer_id  are required`,
      };

      throw err;
    }

    const data: ICreateProductWishList = {
        customer_id, products
    };

    // controller call to save user details
    const result: Result = await productWishlistController.addProductWishlist(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: result.data
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductWishlistExists: Result<IProductWishList[]> =
      await productWishlistController.retrieveProductWishlist();
    if (isProductWishlistExists.isError()) {
      throw isProductWishlistExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting product wishlist details",
      data: isProductWishlistExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:wishlistId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductWishlistExists: Result =
      await productWishlistController.deleteProductWishlistById(parseInt(req.params.wishlistId));
    if (isProductWishlistExists.isError()) {
      throw isProductWishlistExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isProductWishlistExists.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
