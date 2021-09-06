import axios from "axios";
import { CHROME } from "./constant";
import parser from "fast-xml-parser";

export default function youdao(word: string) {
  const url = `http://dict.youdao.com/fsearch?client=deskdict&keyfrom=chrome.extension&pos=-1&doctype=xml&dogVersion=1.0&vendor=unknown&appVer=3.1.17.4208&le=eng&q=${word}`;
  return axios
    .get(url, {
      headers: {
        "user-agent": CHROME,
      },
    })
    .then((data) => {
      const youdaoJson = parser.parse(data.data);
      console.log(JSON.stringify(youdaoJson, null, 2));
      if (youdaoJson?.yodaodict?.["custom-translation"]?.translation) {
        console.log("###!");
        const hwd = youdaoJson.yodaodict["return-phrase"];
        const phonetics = youdaoJson.yodaodict["phonetic-symbol"];
        const translation =
          youdaoJson.yodaodict["custom-translation"].translation;
        const transArr = Array.isArray(translation)
          ? translation
          : [translation];
        const result = transArr.map((trans) => ({
          headword: hwd,
          phonetics,
          shortDefinition: trans.content,
          definition: trans.content,
        }));
        console.log(result);
        return result;
      }
      return [];
    });
}
