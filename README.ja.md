# Valibot デバウンス例

これは、Valibotとカスタムデバウンスバリデーターhookを使ったメール可用性チェックによるフォームバリデーションを実演するNext.jsのサンプルプロジェクトです。

## 機能

- **フォームバリデーション**: React Hook FormとValibotを使ってスキーマベースのバリデーションを行います
- **デバウンスバリデーターHook**: キャッシュ、エラーハンドリング、race condition防止を備えたカスタム`useDebouncedValidator` hook
- **リアルタイムフィードバック**: ユーザーが入力中に即時のバリデーションフィードバックを提供します
- **TypeScript**: TypeScriptで完全に型付けされています
- **Tailwind CSS**: レスポンシブデザインのためのTailwind CSSでスタイル付けされています
- **包括的なテスト**: Vitestを使ったユニットテストとカバレッジレポート

## 技術スタック

- [Next.js](https://nextjs.org) - Reactフレームワーク
- [Valibot](https://valibot.dev) - スキーマバリデーションライブラリ
- [React Hook Form](https://react-hook-form.com) - フォーム処理
- [Tailwind CSS](https://tailwindcss.com) - ユーティリティファーストのCSSフレームワーク
- [TypeScript](https://www.typescriptlang.org) - 型安全なJavaScript
- [Vitest](https://vitest.dev) - ユニットテストフレームワーク

## はじめに

### 前提条件

- Node.js (バージョン18以上)
- pnpm (推奨) または npm/yarn

### インストール

1. リポジトリをクローン:

   ```bash
   git clone git@github.com:naopoyo/valibot-debounce-example.git
   cd valibot-debounce-example
   ```

2. 依存関係をインストール:

   ```bash
   pnpm install
   ```

### 開発サーバーの実行

開発サーバーを起動:

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてサインアップフォームを確認してください。

### 本番ビルド

アプリケーションをビルド:

```bash
pnpm build
```

本番サーバーを起動:

```bash
pnpm start
```

## 使用方法

アプリケーションには以下のフィールドを持つサインアップフォームが含まれます:

- **名前**: 必須のテキストフィールド
- **メール**: 必須のメールフィールドで、形式バリデーションと可用性チェックを行います

メールフィールドは、モックAPIに対してデバウンスチェック（500ms遅延）を行い、メールが利用可能かを確認します。無効なメール（`example@example.com`、`test@example.com`）はエラーメッセージを表示します。

## プロジェクト構造

```text
src/
├── app/
│   ├── api/route.ts          # メール可用性チェック用のモックAPI
│   ├── globals.css           # グローバルスタイル
│   ├── layout.tsx            # ルートレイアウト
│   └── page.tsx              # サインアップフォームのあるホームページ
├── components/
│   └── signup-form.tsx       # サインアップフォームコンポーネント
└── hooks/
    ├── __test__/
    │   └── use-debounced-validator.test.ts # デバウンスバリデーターhookのユニットテスト
    ├── use-debounced-validator.ts      # デバウンスバリデーション用のカスタムhook
    └── use-signup-form.ts              # バリデーション付きのフォームロジック
docs/
└── test-review.md            # テストケースレビュードキュメント
```

## スクリプト

- `pnpm dev` - 開発サーバーを起動
- `pnpm build` - 本番用にビルド
- `pnpm start` - 本番サーバーを起動
- `pnpm test` - Vitestでテストを実行
- `pnpm test:run` - テストを一度実行
- `pnpm test:coverage` - カバレッジレポート付きでテストを実行
- `pnpm lint` - ESLintを実行
- `pnpm lint:fix` - ESLintの問題を修正
- `pnpm prettier` - Prettierでコードをフォーマット
- `pnpm format` - フォーマットとlintの問題を修正
- `pnpm ncu` - 依存関係の更新を確認

## テスト

テストスイートを実行:

```bash
pnpm test
```

カバレッジレポートを生成:

```bash
pnpm test:coverage
```

テストスイートは`useDebouncedValidator` hookに対して23個のテストケースをカバーしており、デバウンス動作、キャッシュ、エラーハンドリング、edge casesを含みます。詳細は`docs/test-review.md`を参照してください。
