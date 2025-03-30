# 📘 React 19 の新フック `use()` 解説ドキュメント

React 19 で導入された新しいフック `use()` は、非同期データの取得や Context の利用をより柔軟かつ直感的にするための革新的な機能です。
`use()` は React の Suspense とシームレスに連携し、非同期処理中の pending 状態やデータ取得完了後の状態を自然に扱えるようにします。

---

## 🔹 基本概要

```tsx
const result = use(promiseOrContext);
```

## 1. Promise にアクセスできる

use() を使えば、Promise をそのまま渡して解決結果を取得できます。従来のように useEffect や useState を組み合わせる必要はありません。

例：

```tsx
import { use, Suspense } from "react";

function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  );
}

function Page() {
  return (
    <Suspense fallback={<div>Loading comments...</div>}>
      <Comments
        commentsPromise={fetch("/api/comments").then((res) => res.json())}
      />
    </Suspense>
  );
}
```

## 2. Context にアクセスできる

use() は Context オブジェクトにも対応しており、従来の useContext() と異なり、条件分岐やループ内でも柔軟に使用できます。

例：

```tsx
import { use } from "react";
import { ThemeContext } from "./ThemeContext";

function ThemedBox({ isThemed }) {
  if (isThemed) {
    const theme = use(ThemeContext);
    return <div className={theme}>Themed Content</div>;
  }
  return <div>Default Content</div>;
}
```

## 3. pending 状態を保持・管理できる

use() で渡された Promise や Context が pending（未解決）状態のとき、React は自動的にそのコンポーネントを サスペンド させ、親の <Suspense> にフォールバックを表示させます。
特徴： - useState / useEffect / isLoading のような状態管理が不要 - 状態遷移のロジックを最小限にできる - フォールバック UI との分離が明確

例：

```tsx
<Suspense fallback={<div>読み込み中...</div>}>
  <BookList booksPromise={fetchBooks()} />
</Suspense>
```

## ✅ 今まで と React 19 (`use()`) の詳細比較表

| 観点                       | React 18 (`useEffect`)                                        | React 19 (`use()`)                             |
| -------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| 非同期処理の記述           | `fetch` + `useEffect` + `useState` が必要                     | `use(promise)` で完結                          |
| loading 状態の管理         | `isLoading` や `useState` が必要                              | `Suspense` に任せるだけ                        |
| 条件分岐・ループ内での使用 | ❌ 不可（Hooks はトップレベルのみ）                           | ✅ 可能（制限なし）                            |
| エラー処理                 | try/catch + `useState` or エラーバウンダリ                    | `ErrorBoundary` に自然に統合                   |
| コードの見通し             | 状態と副作用が混在しやすく複雑                                | 宣言的でシンプルに書ける                       |
| 再レンダー最適化           | 副作用内での状態更新により再レンダーが増える                  | サスペンド状態で管理され不要な更新が抑制される |
| 型安全性                   | 非同期処理の結果を後から型付けする必要あり                    | Promise に型をつけておけばそのまま型推論される |
| 初期値の管理               | `null` や `undefined` などダミー値が必要なことが多い          | 初期値不要、resolve されるまでサスペンドされる |
| ボイラープレート           | `useEffect`, `useState`, `useRef`, `cleanup` などが複雑に絡む | `use(promise)` + `Suspense` だけで完結         |
| パフォーマンス設計         | 慎重に依存配列やメモ化を扱う必要あり                          | Suspense 単位で最適化される設計がしやすい      |

## 5. async / await との関係

    -	use() に渡すのは基本的に Promise（async 関数の戻り値も同様）
    -	use(await somePromise) ではなく、use(somePromise) と書く
    -	use() = await のようなもので、Promise の完了を待って値を取り出す動作をする

```tsx
const data = use(fetch("/api/data").then((res) => res.json()));
```

このコードは、以下と等価な処理を UI レベルで行っています：

```tsx
const res = await fetch("/api/data");
const data = await res.json();
```

## 6 まとめ：use() の導入で得られる主なメリット

    -	✅ Promise も Context も use() で一元管理
    -	✅ useEffect / useState の冗長な記述が激減
    -	✅ サスペンド処理と UI 表示の分離が明確化
    -	✅ より宣言的・シンプルな UI ロジックへ進化
    -	✅ 条件分岐・ループの制約を打破（Hooks ルールの緩和）
