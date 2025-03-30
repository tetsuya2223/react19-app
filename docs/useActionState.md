# useActionState 解説（React 19）

`useActionState` は、React 19 で導入された新しいフックで、**フォームの送信やアクションに基づく状態更新をより簡潔かつ明示的に管理**できる仕組みです。従来の `useState` + `useTransition` や `useReducer` に比べて、**非同期アクションとの統合がスムーズ**になるのが特長です。

---

## ✅ 基本構文

```tsx
const [state, dispatch, isPending] = useActionState(
  async (prevState, formData) => {
    // 非同期処理
    return newState;
  },
  initialState
);
```

- `state`: 現在の状態（例：フォームの入力結果一覧など）
- `dispatch`: `<form action={dispatch}>` で使用可能なアクション関数
- `isPending`: アクション処理中の状態フラグ（true/false）

---

## ✅ 従来までのパターンとの違い

| 項目               | useState + useEffect      | useReducer                     | useActionState                    |
| ------------------ | ------------------------- | ------------------------------ | --------------------------------- |
| フォーム送信の管理 | 自前で fetch & state 更新 | dispatch を定義 & reducer 管理 | 非同期アクションを直接記述        |
| 非同期処理との統合 | useEffect で制御          | thunk など必要                 | Promise を直接扱える              |
| form との連携      | onSubmit など手動管理     | onSubmit で dispatch           | `<form action={dispatch}>` が可能 |
| ローディング状態   | 自分で isLoading を持つ   | 状態に含めて管理               | 第 3 引数 `isPending` が自動付与  |

---

## ✅ メリットまとめ

- ✅ **非同期処理（Promise）をそのまま使える**
- ✅ **`FormData` を使った `<form>` との連携が簡単**
- ✅ **ローディング状態を自動で管理できる (`isPending`)**
- ✅ **状態更新と副作用（アクション）を統合できる**
- ✅ `useReducer` よりもボイラープレートが少ない

---

## ✅ 例：フォームから書籍を追加する

```tsx
const [bookState, addBook, isPending] = useActionState(
  async (prevState, formData) => {
    const name = formData.get("bookName");
    const response = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    const newBook = await response.json();
    return {
      ...prevState,
      books: [...prevState.books, newBook],
    };
  },
  { books: [] }
);

// JSX内
<form action={addBook}>
  <input name="bookName" />
  <button disabled={isPending}>追加</button>
</form>;
```

---

## ✅ まとめ

`useActionState` は、従来の状態管理に加えて「フォーム・非同期・状態更新」を一体化できる強力な新フックです。React 19 以降のフォーム処理において、標準的な選択肢となることが期待されています。
