import express from "express";
import { collection } from "../connection";
import { resp } from "../response";

export default (app: express.Application) => {
  // article list
  app.get("/api/dictionary/collins/", async (req, res) => {
    const word: string = req.query.word as string;
    let result: any[] = [];
    const formsEntry = await collection("forms").findOne({
      hwd: word.toLowerCase(),
    });
    const forms = formsEntry ? formsEntry.bases : [];

    for (const w of [word, ...forms]) {
      result = result.concat(
        await collection("collins")
          .find({ hwd: RegExp(`^${w}$`, "i") })
          .toArray()
      );
    }
    res.json(resp(true, result));
  });
};
