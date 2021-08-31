import React, { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ArticleList from "./components/articlelist/ArticleList";
import Login from "./components/login/Login";
import Myreader, {
  Highlight,
  WordSelectionEvent,
} from "./components/myreader/Myreader";
import Myreaderwithdictionary from "./components/myreaderwithdictionary/Myreaderwithdictionary";
import CardListView from "./views/cardlist/CardListView";
import MainView from "./views/main/MainView";
import ReaderView from "./views/reader/ReaderView";
import axios from "axios";

//为每个请求设置token
axios.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("token")) {
      config.headers.token = localStorage.getItem("token");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//全局错误处理
axios.interceptors.response.use(
  (response) => {
    if (response?.data?.code == 500) {
      // toast.error('')
      window.location.href = `/login?redirect=${encodeURIComponent(
        window.location.href
      )}`;
    }
    if (!response.data.success) {
      toast.error(response.data.message || "出错了~~");
      return Promise.reject(response);
    }

    return response;
  },
  (err) => {
    console.log("打印err", err);
    toast.error("您的网络好像去火星旅行了呢");
    return Promise.reject(err.response);
  }
);

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
          <Route path="/login">
            <Login></Login>
          </Route>
        </Switch>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
