import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BookItem } from "../../types/types";
import "./Booklist.css";
export default function Booklist() {
  const [bookList, setBookList] = useState<BookItem[]>([]);
  const history = useHistory();
  useEffect(() => {
    fetch("/calibre/bookList.json")
      .then((r) => r.json())
      .then((j) => setBookList(j));
  }, []);

  const onSelectBook = (id: string) => {
    history.push(`/book/${id}`);
  };
  return (
    <div className="booklist">
      {bookList.map((book) => (
        <div
          className="book"
          key={book.id}
          onClick={() => {
            onSelectBook(book.id);
          }}
        >
          <img src={book.coverUrl} />
        </div>
      ))}
    </div>
  );
}
