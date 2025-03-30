"use client";

import { use } from "react";
import { BookManage, createBookManage } from "@/admin";

async function fetchBookManager() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Suspense実感用

  const response = await fetch("http://localhost:8080/books");
  const data: BookManage[] = await response.json();
  return data.map((item) => createBookManage(item.id, item.name, item.status));
}

export default function BookList() {
  const books = use(fetchBookManager());

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.name}</li>
      ))}
    </ul>
  );
}
