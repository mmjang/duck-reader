import { DictResultEntry } from "../types/types";
import { forms } from "./forms";

interface CollinsEntry {
  def_cn: string;
  def_en: string;
  display_hwd: string;
  ext: string;
  hwd: string;
  phonetics: string;
  phrase: string;
  sense: string;
}

let hwdsMap: any;

const CDN_PREFIX = "https://cdn.jsdelivr.net/gh/mmjang/dict_hub@main";

function stripSpanTag(html: string) {
  return html
    .replace(/\r|\t|\n/g, "")
    .replace(/^<span.+?>(.*?)<\/span>$/, "$1")
    .trim();
}

function getDefinitionFromEntry(entry: CollinsEntry) {
  return stripSpanTag(entry.def_cn) + " " + stripSpanTag(entry.def_en);
}

function getCDNUrl(word: string): string {
  if (word.length <= 2) {
    return `${CDN_PREFIX}/hub/collins/${word}.json`;
  } else {
    const dir = word.slice(0, 2);
    return `${CDN_PREFIX}/hub/collins/_${dir}/${word}.json`;
  }
}

async function getHWDListToBeSearched(word: string): Promise<string[]> {
  const formsArr = await forms.getBaseForms(word.toLowerCase());
  const result = [word.toLowerCase(), ...formsArr].filter((r) =>
    hwdsMap.has(r)
  );
  return result;
}

export const collins = {
  async search(word: string): Promise<DictResultEntry[]> {
    await this.init();
    if (!hwdsMap) {
      throw "柯林斯还未初始化";
    }
    const result = [];
    const nestedResult = (await Promise.all(
      (await getHWDListToBeSearched(word)).map((w) => {
        return fetch(getCDNUrl(w)).then((r) => r.json());
      })
    )) as CollinsEntry[][];
    for (const resultForOneEntry of nestedResult) {
      for (const definition of resultForOneEntry) {
        result.push(definition);
      }
    }
    return result.map((item) => ({
      headword: item.phrase ? item.phrase : item.hwd,
      phonetics: item.phonetics,
      shortDefinition: stripSpanTag(item.def_cn),
      definition: getDefinitionFromEntry(item),
    }));
  },
  async init() {
    await forms.init();
    if (!hwdsMap) {
      hwdsMap = new Set(
        await fetch(CDN_PREFIX + "/hub/collins.list.json").then((r) => r.json())
      );
    }
    return true;
  },
};
