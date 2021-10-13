import { IconButton } from "@material-ui/core";
import { FavoriteBorder, FavoriteRounded } from "@material-ui/icons";

import "./Favorateicon.css";
export default function Favorateicon({
  status,
  onClick,
}: {
  status: boolean;
  onClick: () => void;
}) {
  return (
    <IconButton
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {status ? (
        <FavoriteRounded color="secondary"></FavoriteRounded>
      ) : (
        <FavoriteBorder></FavoriteBorder>
      )}
    </IconButton>
  );
}
