import React from "react";
import { Toaster } from "react-hot-toast";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import CardListView from "./views/cardlist/CardListView";
import MainView from "./views/main/MainView";
import ReaderView from "./views/reader/ReaderView";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact>
            <MainView></MainView>
          </Route>
          <Route path="/article/:id">
            <ReaderView></ReaderView>
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
