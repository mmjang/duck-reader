import "./Simpleplayer.css";
import PlayArrow from "@material-ui/icons/PlayArrow";
import { IconButton } from "@material-ui/core";
export default function Simpleplayer({ word }) {
  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="menu"
      onClick={() => {
        const audio = document.createElement("audio");
        audio.src = `https://dict.youdao.com/dictvoice?audio=${word}&type=2`;
        audio.play();
      }}
    >
      <PlayArrow />
    </IconButton>
  );
}
