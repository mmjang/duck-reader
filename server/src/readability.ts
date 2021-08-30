import axios from "axios";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

const CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36";

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
