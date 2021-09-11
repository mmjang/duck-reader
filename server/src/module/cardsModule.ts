import express from "express";
import { ObjectId } from "mongodb";
import { collection } from "../connection";
import { resp } from "../response";
import fs from "fs";
// @ts-ignore
import AnkiExport from "anki-apkg-export";
import { file } from "@babel/types";

const genRanHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

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

  app.post("/api/generateApkg", async (req, res) => {
    const payload: { cardIds: string[] } = req.body;
    const cardList = await collection("cards")
      .find({
        _id: { $in: payload.cardIds.map((id) => new ObjectId(id)) },
      })
      .toArray();
    if (cardList.length === 0) {
      res.json(resp(false, null, "没有卡片！"));
      return;
    }
    const apkg = new AnkiExport("填鸭阅读");
    for (const entry of cardList) {
      apkg.addCard(
        `<h3>${entry.dictResult.headword}</h3>
           <p>${entry.sentence}</p>
          `,
        `
           <p>${entry.dictResult.phonetics}</p>
           <p>${entry.dictResult.definition}</p>
          `
      );
    }
    const todayDate = new Date().toISOString().slice(0, 10);
    const fileName = `${todayDate}-${genRanHex(4)}`;
    const path = `/tmp/${fileName}.apkg`;
    apkg.save().then((zip: any) => {
      fs.writeFile(path, zip, "binary", () => {
        res.json(resp(true, { fileName }, "生成成功"));
      });
    });
  });

  app.get("/api/downloadApkg/:fileName", async (req, res) => {
    const fileName = req.params.fileName + ".apkg";
    console.log(fileName);
    res.download(`/tmp/${fileName}`, fileName);
  });
};
