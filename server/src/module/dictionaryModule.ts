import express from "express";
import youdao from "../youdao";
import { baiduFanyi } from "../baidufanyi";
import { collection } from "../connection";
import { resp } from "../response";

function stripSpanTag(html: string) {
  return html
    .replace(/\r|\t|\n/g, "")
    .replace(/^<span.+?>(.*?)<\/span>$/, "$1")
    .trim();
}

function getDefinitionFromEntry(entry: any) {
  return stripSpanTag(entry.def_cn) + " " + stripSpanTag(entry.def_en);
}

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
        (
          await collection("collins")
            .find({ hwd: RegExp(`^${w}$`, "i") })
            .toArray()
        ).map((item) => ({
          headword: item.phrase ? item.phrase : item.hwd,
          phonetics: item.phonetics,
          shortDefinition: stripSpanTag(item.def_cn),
          definition:
            `<span>${item.sense}</span>` + getDefinitionFromEntry(item),
        }))
      );
    }

    if (result.length === 0) {
      result = result.concat(await youdao(word));
    }

    res.json(resp(true, result));
  });
};
