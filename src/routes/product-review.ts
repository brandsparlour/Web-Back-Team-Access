import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as productReviewController from "../controllers/product-review";
import { Result } from "../interfaces/result";
import { ICreateProductReview, IProductReviewDetails } from "../interfaces/product-review";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { product_id, customer_id, rating, review_text } = req.body;

    // validate request body
    if (!product_id || !customer_id || !rating ) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `product_id, customer_id and rating are required`,
      };

      throw err;
    }

    const data: ICreateProductReview = {
        product_id, customer_id, rating, review_text
    };

    // controller call to save user details
    const result: Result = await productReviewController.addProductReview(data);
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
    const isProductReviewExists: Result<IProductReviewDetails[]> = await productReviewController.retrieveProductReviews();
    if (isProductReviewExists.isError()) {
      throw isProductReviewExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting product review details",
      data: isProductReviewExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isProductReviewExists: Result<IProductReviewDetails[]> = await productReviewController.retrieveProductReviewsByProductId(parseInt(req.params.productId));
      if (isProductReviewExists.isError()) {
        throw isProductReviewExists.error;
      }
  
      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: "Getting product review details",
        data: isProductReviewExists.data,
      });
    } catch (error) {
      next(error);
    }
  });

router.delete("/:reviewId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductReviewExists: Result = await productReviewController.deleteProductReviewById(
      parseInt(req.params.reviewId),
    );
    if (isProductReviewExists.isError()) {
      throw isProductReviewExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isProductReviewExists.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
