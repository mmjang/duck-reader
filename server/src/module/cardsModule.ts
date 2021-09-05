import express from "express";
import { ObjectId } from "mongodb";
import { collection } from "../connection";
import { resp } from "../response";

export default (app: express.Application) => {
  // article list
  app.post("/api/addCard", async (req, res) => {
    const payload = req.body;
    await collection("cards").insertOne(payload);
    res.json(resp(true, null, "添加成功"));
  });

  app.get("/api/cardList", async (req, res) => {
    const userId = req.query.userId;
    const result = await collection("cards").find({ userId }).toArray();
    res.json(resp(true, result));
  });

  app.post("/api/deleteCard", async (req, res) => {
    const payload: { cardId: string } = req.body;
    const card = await collection("cards").findOne({
      _id: new ObjectId(payload.cardId),
    });
    if (!card) {
      res.json(resp(true, null, "卡片不存在"));
    }
    if (card.userId !== (req as any).user._id) {
      res.json(resp(true, null, "权限不足"));
    }
    await collection("cards").deleteOne({ _id: new ObjectId(payload.cardId) });
    res.json(resp(true, null, "删除成功"));
  });
};
