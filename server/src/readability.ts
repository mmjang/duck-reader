import axios from "axios";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { CHROME } from "./constant";

export function parseArticle(url: string) {
  return axios
    .get(url, {
      headers: {
        "User-Agent": CHROME,
      },
    })
    .then((result) => {
      //   console.log(result.data);
      const doc = new JSDOM(result.data, {
        url,
      });
      const reader = new Readability(doc.window.document);
      const parsed = reader.parse();
      console.log(parsed);
      return parsed;
    });
}

// parseArticle(
//   "https://www.npr.org/2021/08/30/1032385094/lake-tahoe-wildfire-evacuations-climate-change"
// );
