import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Dictionary from "../dictionary/Dictionary";
import Myreader, { Highlight, WordSelectionEvent } from "../myreader/Myreader";
import "./Myreaderwithdictionary.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useLocalStorage } from "../../utils/hooks";
import { Slide, useScrollTrigger } from "@material-ui/core";
import Favorateicon from "../favorateicon/Favorateicon";

export default function Myreaderwithdictionary() {
  const params = useParams<{ id: string }>();
  const userId = localStorage.getItem("userId");
  const history = useHistory();
  const [articleHtml, setArticleHtml] = useState("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [wordSelection, setWordSelection] = useState<WordSelectionEvent>();
  const [favorateStatus, setFavorateStatus] = useState(false);
  const [fontSize, setFontSize] = useLocalStorage("fontSize", "middle");
  const [fontFamily, setFontFamily] = useLocalStorage("fontFamily", "bookerly");

  useEffect(() => {
    axios
      .get("/api/articleDetail", {
        params: {
          articleId: params.id,
        },
      })
      .then((data) => {
        setArticleHtml(data.data.data.content);
        const favoratedUserList = data.data.data.favoratedUserList || [];
        const isFavorate = favoratedUserList.includes(userId);
        setFavorateStatus(isFavorate);
      });
  }, []);

  const onWordSelection = useCallback((event: WordSelectionEvent) => {
    setWordSelection(event);
    // setHighlights((highlights) => {
    //   return highlights.concat([
    //     {
    //       start: event.word.positions[0],
    //       end: event.word.positions[0] + 1,
    //       type: "word",
    //     },
    //   ]);
    // });
  }, []);

  const trigger = useScrollTrigger();

  return (
    <div className="my-reader-with-dictionary">
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => {
                history.goBack();
              }}
            >
              <ArrowBack />
            </IconButton>
            <div style={{ width: "100%", textAlign: "right" }}>
              <Favorateicon
                status={favorateStatus}
                onClick={() => {
                  axios
                    .post("/api/setFavorate", {
                      articleId: params.id,
                      status: !favorateStatus,
                    })
                    .then((data) => {
                      if (data.data.success) {
                        setFavorateStatus(!favorateStatus);
                      }
                    });
                }}
              ></Favorateicon>
              <Select
                value={fontSize}
                style={{ marginRight: 16 }}
                onChange={(e) => {
                  setFontSize(e.target.value);
                }}
              >
                <MenuItem value={"small"}>小</MenuItem>
                <MenuItem value={"middle"}>中</MenuItem>
                <MenuItem value={"large"}>大</MenuItem>
              </Select>
              <Select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                }}
              >
                <MenuItem value={"bookerly"}>Bookerly</MenuItem>
                <MenuItem value={"faricynew"}>Faricy New</MenuItem>
                <MenuItem value={"sans-serif"}>Sans-serif</MenuItem>
                <MenuItem value={"serif"}>Serif</MenuItem>
              </Select>
            </div>
          </Toolbar>
        </AppBar>
      </Slide>
      <div className="reader">
        {articleHtml ? (
          <Myreader
            html={articleHtml}
            highlights={highlights}
            onWordSelection={onWordSelection}
            fontSize={fontSize}
            fontFamily={fontFamily}
          ></Myreader>
        ) : null}
      </div>
      {wordSelection ? (
        <Dictionary
          word={wordSelection?.word.text}
          sentence={wordSelection?.sentence.text}
          articleId={params.id}
          wordIndex={wordSelection.word.positions[0]}
          onClose={() => {
            setWordSelection(undefined);
          }}
        ></Dictionary>
      ) : null}
    </div>
  );
}
