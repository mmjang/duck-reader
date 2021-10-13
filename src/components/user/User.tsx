import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { User } from "../../types/types";
import ArticleList from "../articlelist/ArticleList";
import "./User.css";
export default function UserPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const history = useHistory();
  useEffect(() => {
    axios
      .get("/api/userinfo", {
        params: {
          userId: params.id,
        },
      })
      .then((data) => {
        setUser(data.data.data);
      });
  }, []);

  const appBar = (
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

        <Typography variant="h6" color="inherit">
          @{user?.name} 的主页
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const [tabIndex, setTabIndex] = useState(0);

  const tabContentList = [
    <ArticleList userId={params?.id}></ArticleList>,
    <ArticleList userId={params?.id} favorate={true}></ArticleList>,
    // <Typography variant="h6">敬请期待</Typography>,
  ];

  return (
    <div className="user">
      {appBar}
      <Tabs
        value={tabIndex}
        onChange={(event, newValue) => {
          setTabIndex(newValue);
        }}
      >
        <Tab label="文章" />
        <Tab label="赞过的" />
        {/* <Tab label="关注" /> */}
      </Tabs>
      {tabContentList[tabIndex]}
    </div>
  );
}
