import { verify, decode } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpUnauthorized } from "../lib/http";
import { paramsSetToken } from "./createJwt";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw HttpUnauthorized();
  }

  const token = authHeader.split(" ")[1];
  try {
    console.log(token, "token");
    verify(token, process.env.SECRET || "1111111111111");

    // Kiểm tra thời gian hết hạn
    if (!tokenExpired(token)) {
      throw HttpUnauthorized("Token has expired");
    }

    next();
  } catch (error) {
    console.log(error);
    throw HttpUnauthorized();
  }
};

const tokenExpired = (token: string): boolean => {
  const { exp } = decode(token) as { exp: number };
  const expTime = process.env.expTime || "3600"; // Mặc định 1 giờ (3600 giây)
  const expirationDatetime = exp + parseInt(expTime);
  return Date.now() < expirationDatetime * 1000; // Chuyển đổi từ giây sang mili giây
};
