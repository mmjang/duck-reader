import { useHistory } from "react-router-dom";
import "./HomeBanner.css";
import FileSaver, { saveAs } from "file-saver";

import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core";

const { Filesystem, Share } = Plugins;

export default function HomeBanner() {
  const history = useHistory();
  async function navigateToCardList() {
    // history.push("/cardlist");
    // const blob = new Blob(["Hello, world!"], {
    //   type: "text/plain;charset=utf-8",
    // });
    // var reader = new FileReader();
    // reader.onloadend = async () => {
    //   var base64data = reader.result;
    //   console.log(base64data);
    //   try {
    //     const result = await Filesystem.writeFile({
    //       path: "text.txt",
    //       data: base64data as string,
    //       directory: FilesystemDirectory.Documents,
    //     });
    //     const uri = await Filesystem.getUri({
    //       path: "text.txt",
    //       directory: FilesystemDirectory.Documents,
    //     });
    //     Share.share({
    //       title: "测试",
    //       url: uri.uri,
    //       dialogTitle: "what the fuck",
    //     });
    //     console.log("Wrote file", result);
    //   } catch (e) {
    //     console.log("write failed", e);
    //   }
    // };
    // reader.readAsDataURL(blob);
  }
  return (
    <div className="home-banner">
      <span className="title">划词网页版</span>
      <div className="card-list-button" onClick={navigateToCardList}>
        卡片列表
      </div>
    </div>
  );
}
