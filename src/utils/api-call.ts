import axios from "axios";
import { Result } from "../interfaces/result";

export const callAPI = async (url: string, method: string, headers: any, body: any) => {
  try {
    const response = await axios({
      url,
      method,
      headers,
      data: body,
    });

    return Result.ok(response.data);
  } catch (error: any) {
    const customMessage =
      error.response.data?.errors && error.response.data?.errors.length > 0 && error.response.data?.errors[0]?.message;

    return Result.error({
      statusCode: error.response?.status ?? 500,
      customMessage: customMessage ?? error.response?.data?.message,
    });
  }
};
