import { serve } from "@hono/node-server";
import { Hono } from "hono";

type BookManager = {
  id: number;
  name: string;
  status: string;
};

const books: BookManager[] = [
  { id: 1, name: "Book 1", status: "在庫あり" },
  { id: 2, name: "Book 2", status: "貸出中" },
  { id: 3, name: "Book 3", status: "返却済" },
];

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/books", (c) => {
  return c.json(books);
});
serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
