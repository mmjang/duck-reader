import express from "express";
import { collection } from "../connection";
import { resp } from "../response";
import { parseArticle } from "../readability";
import { getCleanedUser, isChineseContent } from "../utils";
import { ObjectId } from "mongodb";
import cors from "cors";

export default (app: express.Application) => {
  // 提交文章
  app.post("/api/submitArticle", cors(), async (req, res) => {
    console.log(req.url);
    const payload: {
      url: string;
      description: string;
      disableDuplicate: false;
    } = req.body;
    // 检查链接是否已经提交过
    if (payload.disableDuplicate) {
      const article = await collection("articles").findOne({
        url: payload.url,
      });
      if (article) {
        res.json(resp(false, null, "已有重复文章哦"));
        return;
      }
    }
    parseArticle(payload.url)
      .then(async (parsed) => {
        parsed.content = `<h2>${parsed.title}</h2>` + parsed.content;
        const urlObj = new URL(payload.url);
        const article = {
          url: payload.url,
          hostname: urlObj.hostname,
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
        if (typeof e === "string") {
          res.json(resp(false, null, e));
        } else {
          res.json(resp(false, null, "解析文章失败了，55555"));
        }
      });
  });

  // article list
  app.get("/api/articleList", async (req, res) => {
    const projection = {
      content: 0,
      textContent: 0,
    };
    const userId: string = req.query.userId as string;
    const page: number = +req.query.page || 1;
    const perpage: number = +req.query.perpage || 100;
    const query = userId ? { "user._id": userId } : {};
    const total = await collection("articles").find(query).count();
    res.json(
      resp(true, {
        articles: await collection("articles")
          .find(query)
          .sort({ creationDate: -1 })
          .project(projection)
          .limit(perpage)
          .skip((page - 1) * perpage)
          .toArray(),
        page,
        perpage,
        total,
      })
    );
  });

  app.get("/api/articleDetail", async (req, res) => {
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

  app.post("/api/deleteArticle", async (req, res) => {
    console.log(req.url);
    const payload: { articleId: string } = req.body;
    const articleId = payload.articleId;
    const article = await collection("articles").findOne({
      _id: new ObjectId(articleId),
    });
    if (!article) {
      res.json(resp(false, null, "您要删除的文章不存在"));
      return;
    }
    console.log("");
    if (article.user._id !== (req as any).user._id) {
      res.json(resp(false, null, "权限不足"));
      return;
    }
    await collection("articles").deleteOne({ _id: new ObjectId(articleId) });
    res.json(resp(true, null, "删除成功"));
  });
};
