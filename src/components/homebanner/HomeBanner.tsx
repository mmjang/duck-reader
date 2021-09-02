import { Link, useHistory } from "react-router-dom";
import "./HomeBanner.css";
import duck from "../../asset/duck.png";
import toast from "react-hot-toast";

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

  return (
    <div className="home-banner">
      <div className="status">
        {isLogin ? <Link to="/me">我</Link> : <Link to="/login">登录</Link>}
      </div>
      <span className="title">
        <img src={duck} width={35} />
        填鸭阅读
      </span>
      <div className="card-list-button" onClick={navigateToCardList}>
        我的卡片
      </div>
    </div>
  );
}
