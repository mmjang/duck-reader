import { useHistory } from "react-router-dom";
import ArticleList from "../../components/articlelist/ArticleList";
import Booklist from "../../components/booklist/Booklist";
import HomeBanner from "../../components/homebanner/HomeBanner";
import "./MainView.css";

export default function MainView() {
  const history = useHistory();
  return (
    <div className="home-view">
      <HomeBanner></HomeBanner>
      <ArticleList></ArticleList>
      <div
        className="add-button"
        onClick={() => {
          history.push("/submit");
        }}
      >
        加
      </div>
    </div>
  );
}
