import { Link, useHistory } from "react-router-dom";
import "./HomeBanner.css";
import duck from "../../asset/duck.png";
import toast from "react-hot-toast";
import { Button } from "@material-ui/core";

export default function HomeBanner() {
  const history = useHistory();
  async function navigateToCardList() {
    if (!localStorage.getItem("token")) {
      toast.error("请先登录，然后才能查看卡片列表");
      return;
    }
    history.push("/cardlist");
  }

  const isLogin = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  return (
    <div className="home-banner">
      <div className="status">
        {isLogin ? (
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              history.push(`/user/${userId}`);
            }}
          >
            我
          </Button>
        ) : (
          <Button variant="text" href="/login" color="secondary">
            登录
          </Button>
        )}
      </div>
      <span className="title">
        <img src={duck} width={35} />
        填鸭阅读
      </span>
      <Button
        className="card-list-button"
        onClick={navigateToCardList}
        variant="text"
        color="primary"
      >
        我的卡片
      </Button>
    </div>
  );
}
