import express from "express";
import * as mongodb from "mongodb";
import { collection, connect, db } from "./connection";
import jwt from "jsonwebtoken";
import User from "./model/User";
import { cryptPwd } from "./hash";
import { resp } from "./response";
import { JWT_KEY } from "./config";
import authentication from "./middleware/authentication";

// 链接mongodb数据库
connect();

const app = express();
const port = 8991;

// 中间件
app.use(express.json());
app.use(authentication);

app.get("/", async (req, res) => {
  const one = await collection("users").find({}).toArray();
  res.json(one);
});

// 注册
app.post("/register", async (req, res) => {
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
app.post("/login", async (req, res) => {
  console.log(req.url);
  const payload: { username: string; password: string } = req.body;
  const existingUser = await collection("users").findOne({
    name: payload.username,
  });
  if (existingUser && existingUser.hash === cryptPwd(payload.password)) {
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
app.get("/userinfo", async (req, res) => {
  res.json({
    text: "hello",
  });
});

app.listen(port, () => {
  console.log(`server started at https://localhost:${port}`);
});

const KEY = "afasdfdsfafasd";
const token = jwt.sign({ user: "one two three" }, KEY, { expiresIn: "1s" });

// setTimeout(() => {
//   console.log(jwt.verify(token, KEY));
// }, 500);
