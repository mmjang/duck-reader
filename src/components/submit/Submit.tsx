import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import "./Submit.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";

export default function Submit() {
  const history = useHistory();
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const onDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const onSubmit = () => {
    if (!url) {
      toast.error("你的链接呢？");
      return;
    }
    if (description.length > 140) {
      toast.error("你想说的话太长了， 只能140字以内哦。");
      return;
    }
    const promise = axios
      .post("/api/submitArticle", {
        url,
        description,
      })
      .then((data) => {
        if (data.data.success) {
          history.push("/");
        }
      });
    toast.promise(promise, {
      loading: "正在解析文章网址...",
      success: "文章提交成功。",
      error: "出错...",
    });
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              history.push("/");
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">导入链接</Typography>
        </Toolbar>
      </AppBar>
      <div className="submit">
        <Typography variant="h6">
          提交您想阅读的英文文章链接，然后你和其他小伙伴可以在填鸭阅读查询其中的生词、制作生词卡片
        </Typography>
        <div>
          <TextField
            label="请填入链接"
            value={url}
            onChange={onUrlChange}
            style={{ width: "100%" }}
          ></TextField>
        </div>
        <div>
          <TextField
            label="你想说的话、对文章的点评等（140字以内）"
            value={description}
            onChange={onDescriptionChange}
            multiline
            rows={4}
            style={{ width: "100%" }}
          ></TextField>
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            提交
          </Button>{" "}
        </div>
      </div>
    </>
  );
}
