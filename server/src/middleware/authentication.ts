import * as express from "express";
import jwt from "jsonwebtoken";
import { resp } from "../response";
import { JWT_KEY } from "../config";

const ENDPOINT_NO_AUTH_LIST = [
  "/api/login",
  "/api/register",
  "/api/articleList",
  "/api/articleDetail",
];

function needAuth(url: string) {
  return !ENDPOINT_NO_AUTH_LIST.some((endpoint) => url.startsWith(endpoint));
}

export default function authentication(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!needAuth(req.url)) {
    next();
  } else {
    const token = req.get("token") || "";
    try {
      const user = jwt.verify(token, JWT_KEY);
      (req as any).user = user;
      next();
    } catch (e) {
      res.json(resp(false, null, "token已失效", 500));
    }
  }
}
