import React, { useCallback, useState } from "react";
import { Toaster } from "react-hot-toast";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ArticleList from "./components/articlelist/ArticleList";
import Myreader, {
  Highlight,
  WordSelectionEvent,
} from "./components/myreader/Myreader";
import Myreaderwithdictionary from "./components/myreaderwithdictionary/Myreaderwithdictionary";
import CardListView from "./views/cardlist/CardListView";
import MainView from "./views/main/MainView";
import ReaderView from "./views/reader/ReaderView";

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const onWordSelection = useCallback((event: WordSelectionEvent) => {
    setHighlights((highlights) => {
      return highlights.concat([
        {
          start: event.word.positions[0],
          end: event.word.positions[0] + 1,
          type: "word",
        },
      ]);
    });
  }, []);

  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact>
            <MainView></MainView>
          </Route>
          <Route path="/book/:id">
            <ArticleList></ArticleList>
          </Route>
          <Route path="/article/:id">
            <Myreaderwithdictionary></Myreaderwithdictionary>
          </Route>
          <Route path="/cardlist">
            <CardListView></CardListView>
          </Route>
        </Switch>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
