import { useHistory } from "react-router-dom";
import ArticleList from "../../components/articlelist/ArticleList";
import Booklist from "../../components/booklist/Booklist";
import HomeBanner from "../../components/homebanner/HomeBanner";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import "./MainView.css";

export default function MainView() {
  const history = useHistory();
  return (
    <div className="home-view">
      <HomeBanner></HomeBanner>
      <ArticleList></ArticleList>
      <Fab
        color="primary"
        aria-label="add"
        className="add-button"
        onClick={() => {
          history.push("/submit");
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
