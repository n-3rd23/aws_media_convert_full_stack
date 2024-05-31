import { ApiError } from "@src/utils/error";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Error as MongooseError } from "mongoose";

export const errorConverter = (
  err: ApiError | Error | MongooseError,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error = err;
  if (err instanceof MongooseError) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = "Bad Request";
    error = new ApiError(statusCode, message);
  }
  next(error);
};

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(err.statusCode).json({
    success: false,
    code: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
};
