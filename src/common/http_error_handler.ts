import { Request, Response, NextFunction } from "express";
import { HttpError, HttpStatusCodes } from "../lib/http";

export function HttpErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err && typeof err.HttpStatusCode === "function") {
    const message = err.message;
    res.status(err.HttpStatusCode() || 500).json({
      error: message,
    });
    return;
  }
  console.log(err);
  res.status(500).json({
    error: "internal server error",
  });
}
