import express from "express";
import { connect } from "./connection";
import authentication from "./middleware/authentication";
import articlesModule from "./module/articlesModule";
import cardsModule from "./module/cardsModule";
import dictionaryModule from "./module/dictionaryModule";
import favorateModule from "./module/favorateModule";
import usersModule from "./module/usersModule";

// 链接mongodb数据库
connect();

const app = express();
const port = 8991;

// 注册中间件
app.use(express.json());
app.use(express.urlencoded());
app.use(authentication);

// 注册模块
usersModule(app);
articlesModule(app);
dictionaryModule(app);
cardsModule(app);
favorateModule(app);

// 启动服务
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
