import express from "express";
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
};
