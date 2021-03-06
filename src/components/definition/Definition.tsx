import { DictResultEntry } from "../../types/types";
import "./Definition.css";
import add from "./add.svg";

export default function Definition({
  headword,
  phonetics,
  definition,
  onAdd,
}: DictResultEntry & { onAdd: () => void }) {
  return (
    <div className="definition">
      <div className="hwd-row">
        <img src={add} onClick={onAdd} />
        <b>{headword}</b>
      </div>
      <p dangerouslySetInnerHTML={{ __html: definition }}></p>
    </div>
  );
}
