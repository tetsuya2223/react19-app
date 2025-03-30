"use client";

import { useState, useTransition } from "react";
import { use } from "react";
import { BookManage, createBookManage } from "@/admin";

async function fetchManageBook() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Suspense実感用

  const response = await fetch("http://localhost:8080/books");
  const data: BookManage[] = await response.json();
  return data.map((item) => createBookManage(item.id, item.name, item.status));
}

const fetchManageBookPromise = fetchManageBook();

export default function Home() {
  const initialBooks = use(fetchManageBookPromise);

  const [books, setBooks] = useState<BookManage[]>(initialBooks);
  const [bookName, setBookName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddBook = () => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Suspense実感用
      const response = await fetch("http://localhost:8080/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: bookName }),
      });

      const data = await response.json();
      setBooks((prevBooks) => [
        ...prevBooks,
        createBookManage(data.id, data.name, data.status),
      ]);
      setBookName("");
    });
  };

  return (
    <div>
      <form>
        <input
          type="text"
          name="bookName"
          placeholder="書籍名"
          value={bookName}
          onChange={(e) => {
            setBookName(e.target.value);
          }}
        />
        <button type="submit" onClick={handleAddBook} disabled={isPending}>
          追加
        </button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.name}</li>
        ))}
      </ul>
    </div>
  );
}
