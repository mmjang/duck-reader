import express from "express";
import { collection } from "../connection";
import { resp } from "../response";
import { parseArticle } from "../readability";
import { getCleanedUser, isChineseContent } from "../utils";
import { ObjectId } from "mongodb";

export default (app: express.Application) => {
  // 提交文章
  app.post("/submitArticle", async (req, res) => {
    console.log(req.url);
    const payload: { url: string; description: string } = req.body;
    parseArticle(payload.url)
      .then(async (parsed) => {
        const article = {
          ...parsed,
          creationDate: Date.now(),
          description: payload.description,
          user: getCleanedUser((req as any).user),
        };
        if (isChineseContent(parsed.textContent)) {
          res.json(
            resp(false, null, "似乎是个中文网站，目前只能提交英文文章哦~")
          );
          return;
        }
        const insertedArticle = await collection("articles").insertOne(article);
        res.json(
          resp(
            true,
            await collection("articles").findOne({
              _id: insertedArticle.insertedId,
            })
          )
        );
      })
      .catch((e) => {
        res.json(resp(false, null, "解析文章失败了，55555"));
      });
  });

  // article list
  app.get("/articleList", async (req, res) => {
    const projection = {
      content: 0,
      textContent: 0,
    };
    const userId: string = req.query.userId as string;
    console.log("payload", userId);
    if (userId) {
      res.json(
        resp(
          true,
          await collection("articles")
            .find({ "user._id": new ObjectId(userId) })
            .sort({ creationDate: -1 })
            .project(projection)
            .toArray()
        )
      );
    } else {
      res.json(
        resp(
          true,
          await collection("articles")
            .find({})
            .sort({ creationDate: -1 })
            .project(projection)
            .toArray()
        )
      );
    }
  });

  app.get("/articleDetail", async (req, res) => {
    const articleId = req.query.articleId as string;
    console.log("articleId", articleId);
    const article = await collection("articles").findOne({
      _id: new ObjectId(articleId),
    });
    console.log(article);
    if (article) {
      res.json(resp(true, article));
    } else {
      res.json(resp(false, null, "没有找到该文章"));
    }
  });
};
