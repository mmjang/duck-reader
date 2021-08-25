// @ts-ignore
import AnkiExport from "anki-apkg-export";
import { Plugins, FilesystemDirectory, Capacitor } from "@capacitor/core";
import { saveAs } from "file-saver";
import streamSaver from "streamsaver";
import toast from "react-hot-toast";
import { Card } from "../types/types";
import { bracketToBoldTag } from "../utils/tags";

const { Filesystem, Share } = Plugins;

export async function exportApkg(
  cardList: Card[],
  fileName: string,
  deckName = "duck-reader"
) {
  const apkg = new AnkiExport(deckName);

  for (const entry of cardList) {
    apkg.addCard(
      `<h3>${entry.dictResult.headword}</h3>
         <p>${bracketToBoldTag(entry.sentence)}</p>
        `,
      `
         <p>${entry.dictResult.phonetics}</p>
         <p>${entry.dictResult.definition}</p>
        `
    );
  }

  return new Promise((resolve, reject) => {
    apkg.save().then((zip: any) => {
      if (Capacitor.getPlatform() === "android") {
        var reader = new FileReader();
        reader.onloadend = async () => {
          var base64data = reader.result;
          try {
            const result = await Filesystem.writeFile({
              path: fileName,
              data: base64data as string,
              directory: FilesystemDirectory.Documents,
            });
            resolve(result);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsDataURL(zip);
      } else {
        try {
          // debugger;
          // saveAs(zip, fileName);
          // resolve(true);
          const fileStream = streamSaver.createWriteStream(fileName, {
            size: undefined, // (optional filesize) Will show progress
            writableStrategy: undefined, // (optional)
            readableStrategy: undefined, // (optional)
          });
          new Response(zip).body?.pipeTo(fileStream).then(() => {
            resolve(true);
          });
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}
