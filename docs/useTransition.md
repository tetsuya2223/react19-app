# `useTransition` in React 19

React 19 では、`useTransition` フックが拡張され、非同期処理やフォーム送信の管理がより柔軟に行えるようになりました。

---

## ✅ 基本的な使い方

```tsx
import { useTransition } from "react";

function MyComponent() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      // 状態更新や遷移処理
    });
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isPending}>
        更新
      </button>
      {isPending && <p>処理中...</p>}
    </div>
  );
}
```

この例では、重い処理や非同期更新を「遷移」として扱うことで、UI がブロックされるのを防げます。

---

## ✅ React 19 における拡張ポイント

React 19 では、`startTransition` の中で **非同期関数** を扱えるようになりました。これにより、フォーム送信やエラーハンドリングがより直感的に書けます。

```tsx
import { useState, useTransition } from "react";

function UpdateName() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const error = await updateName(name);
        if (error) {
          setError(error);
          return;
        }
        // 成功時の処理（例：ページ遷移など）
      } catch (err) {
        setError("更新中にエラーが発生しました。");
      }
    });
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        更新
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

---

## ✅ まとめ

- `useTransition` は「UI の応答性」を保ちながら処理を実行するための仕組みです。
- React 19 では、`startTransition` 内で `async/await` が使えるようになり、フォーム送信や非同期 UI 遷移の制御がより簡単に。
- `isPending` を使えば「処理中表示」なども実現可能。

これにより、ユーザー体験を損なわずに滑らかな UI 遷移を構築できます。
