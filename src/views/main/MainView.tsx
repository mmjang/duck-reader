import ArticleList from "../../components/articlelist/ArticleList";
import HomeBanner from "../../components/homebanner/HomeBanner";
import "./MainView.css";

export default function MainView() {
  return (
    <div className="home-view">
      <HomeBanner></HomeBanner>
      <ArticleList sourceUrl="/data/section/editor.json"></ArticleList>
    </div>
  );
}
