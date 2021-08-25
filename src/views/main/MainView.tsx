import ArticleList from "../../components/articlelist/ArticleList";
import Booklist from "../../components/booklist/Booklist";
import HomeBanner from "../../components/homebanner/HomeBanner";
import "./MainView.css";

export default function MainView() {
  return (
    <div className="home-view">
      <HomeBanner></HomeBanner>
      <Booklist></Booklist>
    </div>
  );
}
