import { card } from "../../api/card";
import WordCard from "../wordcard/WordCard";
import "./CardList.css";

export default function CardList() {
  return (
    <div className="card-list">
      {card.getCardList().map((card, index) => (
        <WordCard {...card} defaultState="show" key={index}></WordCard>
      ))}
    </div>
  );
}
