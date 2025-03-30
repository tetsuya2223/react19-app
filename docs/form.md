# React 19 におけるフォームの新機能まとめ

React 19 では、フォームの取り扱いに関していくつかの重要なアップデートが行われました。このドキュメントでは、主な変更点や新フック、従来との違いについてまとめます。

---

## ✅ 1. フォーム送信の簡素化

React 19 では、フォームの `action` 属性にサーバー関数を直接指定できるようになりました。これにより、`onSubmit` や `useState` を使った冗長な処理が不要になります。

### 従来の方法

```tsx
const [name, setName] = useState("");

<form
  onSubmit={async (e) => {
    e.preventDefault();
    await updateName(name);
  }}
>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <button>更新</button>
</form>;
```

### React 19 の方法

```tsx
<form action={updateName}>
  <input name="name" />
  <button type="submit">更新</button>
</form>
```

---

## ✅ 2. useActionState による状態管理

フォーム送信に伴う状態（結果・ローディング・エラーなど）を `useActionState` フックでシンプルに管理できます。

```tsx
const [state, dispatch, isPending] = useActionState(
  async (prevState, formData) => {
    const name = formData.get('name');
    const res = await fetch(...);
    return { ...prevState, name };
  },
  { name: '' }
);

<form action={dispatch}>
  <input name="name" />
  <button disabled={isPending}>送信</button>
</form>
```

---

## ✅ 3. useOptimistic による楽観的 UI 更新

ユーザーの操作に即座に反応し、サーバー処理が完了する前に UI を更新したいときに便利です。

```tsx
const [optimisticName, setOptimisticName] = useOptimistic("");

<form
  onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    setOptimisticName(name);
    await updateName(name);
  }}
>
  <input name="name" defaultValue={optimisticName} />
  <button>更新</button>
</form>;
```

---

## ✅ 4. サーバ関数との統合

フォームの `action` に直接指定できるサーバ関数は、App Router の機能を使って定義されます：

```tsx
// app/actions.ts
"use server";

export async function updateName(formData: FormData) {
  const name = formData.get("name");
  await db.user.update({ name });
}
```

---

## ✅ まとめ

| 機能             | React 18 まで             | React 19                      |
| ---------------- | ------------------------- | ----------------------------- |
| フォーム送信     | `onSubmit` でイベント処理 | `action` 属性に直接関数を渡す |
| 状態管理         | `useState` や手動制御     | `useActionState` で一元管理   |
| 楽観的 UI 更新   | 独自実装が必要            | `useOptimistic` で簡単に実現  |
| サーバ通信の統合 | fetch, axios など         | App Router + server functions |

React 19 により、フォーム関連の開発体験が大幅に改善されました。

---

## ✅ 補足：FormData による入力値の取得

React 19 の `<form action={...}>` では、フォーム送信時に自動的に `FormData` が生成され、`action` 関数や `useActionState` の引数として渡されます。

これにより、JavaScript 側で `input` の状態を個別に管理しなくても、`formData.get("name")` のようにして簡単に入力値を取得できます。

```tsx
const [state, dispatch] = useActionState(
  async (prevState, formData) => {
    const name = formData.get("name"); // ← ここで name を取得
    return { ...prevState, name };
  },
  { name: "" }
);

<form action={dispatch}>
  <input name="name" />
  <button>送信</button>
</form>;
```

この仕組みにより、冗長な状態管理や `onChange` イベントが不要になるため、フォーム周りの実装が非常にシンプルになります。
