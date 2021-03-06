import { useHistory } from "react-router-dom";
import "./HomeBanner.css";

export default function HomeBanner() {
  const history = useHistory();
  function navigateToCardList() {
    history.push("/cardlist");
  }
  return (
    <div className="home-banner">
      <span className="title">划词网页版</span>
      <div className="card-list-button" onClick={navigateToCardList}>
        卡片列表
      </div>
    </div>
  );
}
