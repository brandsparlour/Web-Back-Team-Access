import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as cartController from "../controllers/cart";
import { Result } from "../interfaces/result";
import { ICartDetail, ICreateCart } from "../interfaces/cart";



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

    const data: ICreateCart = {
        customer_id, products
    };

    // controller call to save user details
    const result: Result = await cartController.addCart(data);
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
    const isCartExists: Result<ICartDetail[]> =
      await cartController.retrieveCart();
    if (isCartExists.isError()) {
      throw isCartExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Getting cart details",
      data: isCartExists.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:customerId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCartExists: Result<ICartDetail[]> =
        await cartController.retrieveCartByCustomerId(parseInt(req.params.customerId));
      if (isCartExists.isError()) {
        throw isCartExists.error;
      }
  
      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: "Getting cart details",
        data: isCartExists.data,
      });
    } catch (error) {
      next(error);
    }
  });

router.delete("/:cartId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCartExists: Result =
      await cartController.deleteCartById(parseInt(req.params.cartId));
    if (isCartExists.isError()) {
      throw isCartExists.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: isCartExists.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
