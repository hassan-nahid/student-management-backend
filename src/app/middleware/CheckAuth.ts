import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";
import { verifyToken } from "../modules/auth/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;


        if (!accessToken) {
          throw new AppError(httpStatus.FORBIDDEN, "No token received");
        }

        const verifiedToken = verifyToken(
          accessToken,
          envVars.JWT_ACCESS_SECRET
        ) as JwtPayload;

        const user = await User.findOne({ email: verifiedToken.email });

        if (!user) {
          throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
        }

        if (
          user.isActive === IsActive.BLOCKED ||
          user.isActive === IsActive.INACTIVE
        ) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            `User is ${user.isActive.toLowerCase()}`
          );
        }

        if (!authRoles.includes(verifiedToken.role)) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not permitted to view this route!"
          );
        }

        req.user = verifiedToken;
        next();
      } catch (error) {
        next(error);
      }
    };