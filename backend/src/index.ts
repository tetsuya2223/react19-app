import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

type BookManager = {
  id: number;
  name: string;
  status: string;
};

const books: BookManager[] = [
  { id: 1, name: "React", status: "在庫あり" },
  { id: 2, name: "JavaScript", status: "貸出中" },
  { id: 3, name: "Next.js", status: "返却済" },
];

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 3600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/books", (c) => {
  const query = c.req.query();
  const keyword = query.keyword;

  if (keyword) {
    const filteredBooks = books.filter((book) => book.name.includes(keyword));
    return c.json(filteredBooks);
  }
  return c.json(books);
});

app.post("/books", async (c) => {
  const body = await c.req.json();
  const name = body["name"];

  if (!name) {
    return c.json({ error: "書名が入力されていません" });
  }

  const newBook = {
    id: books.length + 1,
    name: name,
    status: "在庫あり",
  };
  books.push(newBook);

  return c.json(newBook);
});

app.put("/books/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const status = body["status"];

  const book = books.find((book) => book.id === Number(id));

  if (!book) {
    return c.json({ error: "書籍が見つかりません" });
  }
  book.status = status;

  return c.json(book);
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
