import { Card } from "../types/types";

const CARD_LIST_KEY = "card_list_key";

let cardList: Card[] = JSON.parse(localStorage.getItem(CARD_LIST_KEY) || "[]");

// 初始化exported属性，最早的版本没这个
for (const c of cardList) {
  if (c.exported === undefined) {
    c.exported = false;
  }
}

function saveCardList() {
  localStorage.setItem(CARD_LIST_KEY, JSON.stringify(cardList, null, 2));
}

export const card = {
  getCardList() {
    return cardList;
  },
  setCardList(cList: Card[]) {
    cardList = cList;
    saveCardList();
  },
  addCard(card: Card) {
    cardList.push(card);
    saveCardList();
  },
  deleteCard(id: string) {
    const index = cardList.findIndex((card) => card.id === id);
    if (~index) {
      cardList.splice(index, 1);
      saveCardList();
    } else {
      throw new Error(`card with id ${id} not exist.`);
    }
  },
  findCard(id: string) {
    return cardList.find((card) => card.id === id);
  },
  modifyCard(id: string, card: Card) {
    const index = cardList.findIndex((card) => card.id === id);
    if (~index) {
      cardList[index] = card;
      saveCardList();
    } else {
      throw new Error(`card with id ${id} not exist.`);
    }
  },
};
