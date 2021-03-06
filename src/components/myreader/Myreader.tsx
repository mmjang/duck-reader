import { start } from "node:repl";
import React, { useEffect, useRef } from "react";
import "./Myreader.css";
import { TEST_HTML } from "./testdata";

type TokenType = "word" | "blank" | "punctuation";

function getTokenType(text: string): TokenType {
  if (isEmptyString(text)) {
    return "blank";
  } else if (text.match(/[a-z]+/)) {
    return "word";
  } else {
    return "punctuation";
  }
}

function isEmptyString(str: string) {
  return str.replace(/\\n|\\t/g, "").trim() === "";
}

function isSentenceEnd(str: string) {
  const trimmed = str.trim();
  return (
    trimmed.endsWith(".") ||
    trimmed.endsWith("?") ||
    trimmed.endsWith("!") ||
    trimmed.endsWith('."') ||
    trimmed.endsWith('?"') ||
    trimmed.endsWith('!"')
  );
}

function isParagraphEnd(token: Element): boolean {
  let t = token;
  while (t.parentElement) {
    let child = t;
    t = t.parentElement;
    if (t.lastElementChild === child) {
      if (getComputedStyle(t).display === "block") {
        return true;
      }
    } else {
      return false;
    }
  }
  return false;
}

// markable
function toMarkable(container: Element) {
  if (document.querySelector(".token-class")) {
    return container;
  }
  const containerClone = container.cloneNode(true);
  const TOKEN_CLASS = "token-class";
  function isTokenSpan(node: Element) {
    return node.nodeName === "SPAN" && node.classList.contains(TOKEN_CLASS);
  }
  function token(text: string) {
    const ele = document.createElement("span");
    ele.innerHTML = text;
    ele.classList.add(TOKEN_CLASS);
    ele.classList.add(getTokenType(text));
    return ele;
  }
  function toTokenSpan(node: Element) {
    if (!node) {
      return;
    }
    let index = 0;
    // textnode
    const nodeValue = node.nodeValue || "";
    if (node.nodeType === 3 && !isEmptyString(nodeValue)) {
      nodeValue.split(/\b/).forEach((t) => {
        return node.before(token(t));
      });
      node.remove();
    } else if (node.nodeType === 1) {
      Array.from((node as Node).childNodes).forEach((n) => {
        if (!isTokenSpan(n as Element)) {
          toTokenSpan(n as Element);
        }
      });
    }
  }
  const tokenized = toTokenSpan(containerClone as Element);
  container.before(containerClone);
  container.remove();
  const tokenList = Array.from(document.querySelectorAll(".token-class"));
  for (const token of tokenList) {
    if (isParagraphEnd(token)) {
      token.classList.add("para-end");
    }
  }
  return containerClone;
  // containerClone.addEventListener("click", (e) => {
  //   alert(e?.target);
  // });
}

function bindEvent(
  container: HTMLDivElement,
  tokenListRef: React.MutableRefObject<Element[]>,
  onWordSelection: ((event: WordSelectionEvent) => void) | undefined
) {
  const tokenList = Array.from(document.querySelectorAll(".token-class"));
  tokenListRef.current = tokenList;

  const onClick = (e: MouseEvent) => {
    const token = (e.target as Element).closest(".token-class");
    if (token) {
      const sentence = getSentence(tokenList, token);
      console.log(sentence);
      if (sentence && onWordSelection) {
        onWordSelection({
          word: {
            text: token.textContent || "",
            positions: [sentence.wordIndex],
          },
          sentence: {
            text: sentence.formatedSentence,
            positions: [
              {
                start: sentence.startIndex,
                end: sentence.endIndex,
              },
            ],
          },
        });
      }
    }
  };

  container.addEventListener("click", onClick);

  return () => {
    console.log("unbind reader click listeners.");
    container.removeEventListener("click", onClick);
  };
}

function getSentence(
  tokenList: Element[],
  selectedToken: Element
): {
  startIndex: number;
  endIndex: number;
  wordIndex: number;
  formatedSentence: string; // The [[selected]] word is this
} | null {
  const selectedTokenIndex = tokenList.indexOf(selectedToken);
  if (selectedTokenIndex < 0) {
    return null;
  } else {
    let maxLength = 100;
    let left = selectedTokenIndex;
    while (left >= 0) {
      left--;
      if (
        tokenList[left].classList.contains("para-end") ||
        isSentenceEnd(tokenList[left].innerHTML)
      ) {
        break;
      }
    }
    left++;
    let right = selectedTokenIndex;
    while (right < tokenList.length) {
      if (
        tokenList[right].classList.contains("para-end") ||
        isSentenceEnd(tokenList[right].innerHTML)
      ) {
        break;
      }
      right++;
    }
    right++;
    return {
      startIndex: left,
      endIndex: right,
      wordIndex: selectedTokenIndex,
      formatedSentence: tokenList
        .slice(left, right)
        .map((token, index) => {
          if (index + left === selectedTokenIndex) {
            return `[[${token.innerHTML}]]`;
          } else {
            return token.innerHTML;
          }
        })
        .join(""),
    };
  }
}

export interface Highlight {
  start: number;
  end: number;
  type: "sentence" | "word";
}

export interface WordSelectionEvent {
  word: {
    text: string;
    positions: number[];
  };
  sentence: {
    text: string;
    positions: {
      start: number;
      end: number;
    }[];
  };
}
/**
 * ?????????????????????????????????html????????????????????????????????????
 * 1. ??????????????????????????????????????????????????????+????????????
 * 2. ?????????????????????id????????????????????????????????????????????????
 * 3. ?????????html???????????????????????????????????????????????????????????????
 *    ??????????????????????????????mozilla readability??????????????????
 */

export default function Myreader({
  html = TEST_HTML,
  highlights = [],
  onWordSelection,
}: {
  html?: string;
  highlights?: Highlight[];
  setHighlights?: (hls: Highlight[]) => void;
  onWordSelection?: (event: WordSelectionEvent) => void;
}) {
  const readerRef = useRef<HTMLDivElement>(null);
  const tokenListRef = useRef<Element[]>([]);

  // ????????????
  useEffect(() => {
    if (readerRef.current) {
      toMarkable(readerRef.current.firstElementChild as Element) as HTMLElement;
      return bindEvent(
        readerRef.current.firstElementChild as HTMLDivElement,
        tokenListRef,
        onWordSelection
      );
    }
  }, [highlights]);

  // ????????????
  useEffect(() => {
    for (const token of tokenListRef.current) {
      token.classList.remove("highlight");
    }

    for (const hl of highlights) {
      if (tokenListRef.current.length > 0) {
        for (let i = hl.start; i < hl.end; i++) {
          tokenListRef.current[i].classList.add("highlight");
        }
      }
    }
  }, [highlights]);

  // useEffect(() => {
  //   throw "????????????html????????????????????????????????????";
  // }, [html]);

  return (
    <div ref={readerRef} className="myreader">
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </div>
  );
}
