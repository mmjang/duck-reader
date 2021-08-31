import express from "express";
import { collection } from "../connection";
import jwt from "jsonwebtoken";
import User from "../model/User";
import { cryptPwd } from "../hash";
import { resp } from "../response";
import { JWT_KEY } from "../config";
import { getCleanedUser } from "../utils";

export default (app: express.Application) => {
  // 注册
  app.post("/api/register", async (req, res) => {
    const payload: { username: string; password: string } = req.body;
    const existingUser = await collection("users").findOne({
      name: payload.username,
    });
    if (existingUser) {
      res.json(resp(false, null, "已存在同名用户"));
    } else {
      if (payload.password.length < 6) {
        res.json(resp(false, null, "密码至少6位"));
      } else {
        const user: User = {
          name: payload.username,
          hash: cryptPwd(payload.password),
          creationDate: Date.now(),
          enabled: true,
        };
        await collection("users").insertOne(user);
        res.json(resp(true));
      }
    }
  });

  // 登录
  app.post("/api/login", async (req, res) => {
    console.log(req.url);
    const payload: { username: string; password: string } = req.body;
    const existingUser = await collection("users").findOne({
      name: payload.username,
    });
    if (
      existingUser &&
      existingUser.hash === cryptPwd(payload.password || "")
    ) {
      res.json(
        resp(
          true,
          {
            token: jwt.sign(existingUser, JWT_KEY, { expiresIn: "365d" }),
          },
          "登录成功"
        )
      );
    } else {
      res.json(resp(false, null, "账号名或密码错误"));
    }
  });

  // 用户信息
  app.get("/api/userinfo", async (req, res) => {
    res.json(resp(true, getCleanedUser((req as any).user)));
  });
};
