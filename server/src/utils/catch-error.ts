import { NextFunction, Request, Response } from "express";

export const catchError =
  (fn: (request: Request, response: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
