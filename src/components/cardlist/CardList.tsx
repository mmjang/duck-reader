import { card } from "../../api/card";
import WordCard from "../wordcard/WordCard";
// @ts-ignore
import AnkiExport from "anki-apkg-export";
import "./CardList.css";
import { bracketToBoldTag } from "../../utils/tags";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core";
import toast from "react-hot-toast";

const { Filesystem, Share } = Plugins;

export default function CardList() {
  function exportApkg() {
    const apkg = new AnkiExport("Anki划词助手-WEB");

    for (const entry of card.getCardList()) {
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
    return apkg.save().then((zip: any) => {
      var reader = new FileReader();
      reader.onloadend = async () => {
        var base64data = reader.result;
        console.log(base64data);
        try {
          const result = await Filesystem.writeFile({
            path: "duck-web.apkg",
            data: base64data as string,
            directory: FilesystemDirectory.Documents,
          });
          // const uri = await Filesystem.getUri({
          //   path: "text.txt",
          //   directory: FilesystemDirectory.Documents,
          // });
          // Share.share({
          //   title: "测试",
          //   url: uri.uri,
          //   dialogTitle: "what the fuck",
          // });
          toast("导出成功，位置：sdcard/documents/");
        } catch (e) {
          console.log("write failed", e);
        }
      };
      reader.readAsDataURL(zip);
    });
  }
  return (
    <>
      <button onClick={exportApkg}>导出.apkg</button>
      <div className="card-list">
        {card.getCardList().map((card, index) => (
          <WordCard {...card} defaultState="show" key={index}></WordCard>
        ))}
      </div>
    </>
  );
}
