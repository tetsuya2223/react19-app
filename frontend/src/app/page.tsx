"use client";

import { useActionState } from "react";
import { use } from "react";
import { BookManage, createBookManage } from "@/admin";

async function fetchManageBook() {
  const response = await fetch("http://localhost:8080/books");
  const data: BookManage[] = await response.json();
  return data.map((item) => createBookManage(item.id, item.name, item.status));
}

const fetchManageBookPromise = fetchManageBook();

export default function Home() {
  const initialBooks = use(fetchManageBookPromise);

  const [bookState, updateBookState, isPending] = useActionState(
    async (prevState: { allBooks: BookManage[] }, formData: FormData) => {
      const name = formData.get("bookName");
      if (!name) {
        throw new Error("name is undefined");
      }

      const response = await fetch("http://localhost:8080/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const newBook: BookManage = await response.json();

      return {
        allBooks: [
          ...prevState.allBooks,
          createBookManage(newBook.id, newBook.name, newBook.status),
        ],
      };
    },
    {
      allBooks: initialBooks,
    }
  );

  return (
    <div>
      <form action={updateBookState}>
        <input type="text" name="bookName" placeholder="書籍名" />
        <button type="submit" disabled={isPending}>
          追加
        </button>
      </form>
      <ul>
        {bookState.allBooks.map((book) => (
          <li key={book.id}>{book.name}</li>
        ))}
      </ul>
    </div>
  );
}
