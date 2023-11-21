import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as productCategoryController from "../controllers/product-category";
import { Result } from "../interfaces/result";
import { ICreateProductCategory, IProductCategoryDetails } from "../interfaces/product-category";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category_name, parent_category, description } = req.body;

    // validate request body
    if (!category_name ) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `category_name  are required`,
      };

      throw err;
    }

    const data: ICreateProductCategory = {
      category_name,
      parent_category,
      description,
    };

    // controller call to save user details
    const result: Result = await productCategoryController.addProductReview(data);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created product category",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductCategoryExists: Result<IProductCategoryDetails[]> =
      await productCategoryController.retrieveProductCategories();
    if (isProductCategoryExists.isError()) {
      throw isProductCategoryExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting product category details",
      data: isProductCategoryExists.data,
    });
  } catch (error) {
    next(error);
  }
});


router.delete("/:categoryId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProductCategoryExists: Result =
      await productCategoryController.deleteProductCategoryById(parseInt(req.params.categoryId));
      
    if (isProductCategoryExists.isError()) {
      throw isProductCategoryExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isProductCategoryExists.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
