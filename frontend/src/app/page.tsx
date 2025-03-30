import { Suspense } from "react";
import BookList from "./components/BookList";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div>Loading・・・</div>}>
        <BookList />
      </Suspense>
    </div>
  );
}
