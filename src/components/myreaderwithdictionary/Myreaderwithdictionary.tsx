import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Dictionary from "../dictionary/Dictionary";
import Myreader, { Highlight, WordSelectionEvent } from "../myreader/Myreader";
import "./Myreaderwithdictionary.css";

export default function Myreaderwithdictionary() {
  const params = useParams<{ id: string }>();
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
    <div>
      {articleHtml ? (
        <Myreader
          html={articleHtml}
          highlights={highlights}
          onWordSelection={onWordSelection}
        ></Myreader>
      ) : null}
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
