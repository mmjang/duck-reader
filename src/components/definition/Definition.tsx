import { DictResultEntry } from "../../types/types";
import "./Definition.css";
import add from "./add.svg";
import ankimobile from "../../asset/ankimobile.png";
import Simpleplayer from "../simpleplayer/Simpleplayer";

export default function Definition({
  headword,
  phonetics,
  definition,
  onAdd,
  onAddAnki,
}: DictResultEntry & { onAdd: () => void; onAddAnki?: () => void }) {
  return (
    <div className="definition">
      <div className="hwd-row">
        <img src={add} onClick={onAdd} />
        {onAddAnki ? (
          <img src={ankimobile} onClick={onAddAnki} width={30} />
        ) : null}
        <b>{headword}</b> <Simpleplayer word={headword}></Simpleplayer>
      </div>
      <p dangerouslySetInnerHTML={{ __html: definition }}></p>
    </div>
  );
}
