import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import "./Submit.css";
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
    }
    if (description.length > 140) {
      toast.error("你想说的话太长了， 只能140字以内哦。");
    }
    axios
      .post("/api/submitArticle", {
        url,
        description,
      })
      .then((data) => {
        if (data.data.success) {
          toast.success("提交成功");
          history.push("/");
        }
      });
  };
  return (
    <div className="submit">
      <Link to="/">首页</Link>
      <h5>
        提交您想阅读的英文文章链接，然后你和其他小伙伴可以在填鸭阅读查询其中的生词、制作生词卡片
      </h5>
      <input
        type="text"
        placeholder="请填入链接"
        className="url"
        value={url}
        onChange={onUrlChange}
      ></input>
      <textarea
        placeholder="你想说的话、对文章的点评等（140字以内）"
        className="desc"
        value={description}
        onChange={onDescriptionChange}
      ></textarea>
      <button onClick={onSubmit}>好</button>
    </div>
  );
}
