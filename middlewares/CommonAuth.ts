import { AuthPayLoad } from "../dto/Auth.dto";
import { Request, Response, NextFunction } from "express";
import { ValidatePassword, ValidateSignature } from "../util";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayLoad;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignature(req);
  console.log("Validate status: ", validate);
  if (!validate) {
    res.status(400).json({ message: "Not authorized" });
    return;
  }
  next();
  return;
};
