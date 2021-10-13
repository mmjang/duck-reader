import express from "express";
import { collection, db } from "../connection";
import { resp } from "../response";
import { parseArticle } from "../readability";
import { getCleanedUser, isChineseContent } from "../utils";
import { ObjectId } from "mongodb";
import cors from "cors";

export default (app: express.Application) => {
  /**
   * 为某篇文章设置点赞状态
   * articleId: string 被点赞的文章
   * status: boolean 点赞还是取消点赞
   */
  app.post("/api/setFavorate", cors(), async (req: any, res) => {
    console.log(req.url);
    console.log(req.body);
    const userId = req.user._id;
    const {
      articleId,
      status,
    }: {
      articleId: string;
      status: boolean;
    } = req.body;
    const article = await collection("articles").findOne({
      _id: new ObjectId(articleId),
    });
    if (!article) {
      res.json(resp(false, null, "文章不存在"));
      return;
    }
    // 新建点赞记录
    if (status) {
      const existingFavorate = await collection("favorate").findOne({
        userId,
        articleId,
      });
      // 已经点过赞
      console.log("已经点过赞了", existingFavorate);
      if (existingFavorate) {
        res.json(resp(false, null, "已经点过赞了。"));
        return;
      }
      await collection("favorate").insertOne({
        userId,
        articleId,
        date: Date.now(),
      });
      console.log(111);
      const favoratedUserList = article.favoratedUserList || [];
      favoratedUserList.push(userId);
      // 更新article表中的点赞用户列表
      await collection("articles").updateOne(
        {
          _id: new ObjectId(articleId),
        },
        {
          $set: { favoratedUserList },
        }
      );
      console.log(222);
      res.json(resp(true, null, "点赞成功"));
    } else {
      // 取消点赞记录
      await collection("favorate").deleteMany({
        userId,
        articleId,
      });
      const favoratedUserList = article.favoratedUserList || [];
      // 去掉article表中的点赞用户
      await collection("articles").updateOne(
        {
          _id: new ObjectId(articleId),
        },
        {
          $set: {
            favoratedUserList: favoratedUserList.filter(
              (f: any) => f !== userId
            ),
          },
        }
      );
      res.json(resp(true, null, "取消点赞成功"));
    }
  });
};
