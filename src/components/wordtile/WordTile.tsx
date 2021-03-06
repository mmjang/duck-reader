import { makeClasses } from "../../utils";
import "./WordTile.css";

type Props = {
  id: number;
  text: string;
  selected: boolean;
  onClick: (id: number) => void;
};

export default function WordTile({ id, text, selected, onClick }: Props) {
  function onTileClick(e: React.MouseEvent) {
    e.stopPropagation();
    onClick(id);
  }
  return (
    <span
      onClick={onTileClick}
      className={makeClasses({
        "word-tile": true,
        selected,
      })}
    >
      {text}
    </span>
  );
}
