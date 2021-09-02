import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Dictionary from "../dictionary/Dictionary";
import Myreader, { Highlight, WordSelectionEvent } from "../myreader/Myreader";
import "./Myreaderwithdictionary.css";
import back from "../../asset/back.svg";

export default function Myreaderwithdictionary() {
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [articleHtml, setArticleHtml] = useState("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [wordSelection, setWordSelection] = useState<WordSelectionEvent>();

  useEffect(() => {
    axios
      .get("/api/articleDetail", {
        params: {
          articleId: params.id,
        },
      })
      .then((data) => {
        setArticleHtml(data.data.data.content);
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
  return (
    <div className="my-reader-with-dictionary">
      <div className="reader-banner">
        <div
          onClick={() => {
            history.goBack();
          }}
        >
          <img src={back} width="35" />
        </div>
      </div>
      <div className="reader">
        {articleHtml ? (
          <Myreader
            html={articleHtml}
            highlights={highlights}
            onWordSelection={onWordSelection}
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
