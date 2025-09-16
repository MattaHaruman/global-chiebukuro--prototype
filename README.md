# Global知恵袋 - Q&A Platform

Yahoo!知恵袋のようなQ&Aサイトのプロトタイプです。Next.js、TypeScript、Prisma、NextAuth.jsを使用し、DeepL APIによる自動翻訳機能を備えています。

## 機能

- **ユーザー認証**: GitHub OAuthによるログイン
- **質問投稿**: ログインユーザーが質問を投稿可能
- **回答投稿**: ログインユーザーが回答を投稿可能
- **自動翻訳**: ブラウザの言語設定に応じてDeepL APIで翻訳
- **レスポンシブデザイン**: Tailwind CSSによるモダンなUI

## 技術スタック

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (開発), PostgreSQL (本番想定)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **State Management**: TanStack Query
- **Translation**: DeepL API
- **Deployment**: Vercel

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- GitHub アカウント (OAuth用)
- DeepL API キー (翻訳機能用)

### 開発環境のセットアップ

1. **リポジトリをクローン**:
   ```bash
   git clone <repository-url>
   cd global-chiebukuro--prototype
   ```

2. **依存関係をインストール**:
   ```bash
   npm install
   ```

3. **環境変数を設定**:
   `.env.local.example`を`.env.local`にコピーし、必要な値を設定:
   ```bash
   cp .env.local.example .env.local
   ```
   
   設定が必要な環境変数:
   - `NEXTAUTH_SECRET`: NextAuth.jsのシークレット
   - `GITHUB_ID`: GitHub OAuth App ID
   - `GITHUB_SECRET`: GitHub OAuth App Secret
   - `DEEPL_API_KEY`: DeepL API キー
   - `DATABASE_URL`: データベース接続URL

4. **GitHub OAuth Appを作成**:
   - GitHub Settings > Developer settings > OAuth Apps
   - 新しいOAuth Appを作成
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

5. **データベースを初期化**:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

6. **開発サーバーを起動**:
   ```bash
   npm run dev
   ```

   http://localhost:3000 でアプリケーションにアクセス

## Vercelでのデプロイ

### 1. Vercelプロジェクトを作成

1. [Vercel](https://vercel.com)にログイン
2. 新しいプロジェクトを作成
3. GitHubリポジトリを接続

### 2. 環境変数を設定

Vercelダッシュボードで以下の環境変数を設定:

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
DEEPL_API_KEY=your-deepl-api-key
DATABASE_URL=your-production-database-url
```

### 3. データベース設定

本番環境では PostgreSQL を推奨:
- Railway、Supabase、PlanetScaleなどのサービスを利用
- `DATABASE_URL`に接続文字列を設定

### 4. GitHub OAuth設定を更新

本番用のコールバックURLを追加:
```
https://your-domain.vercel.app/api/auth/callback/github
```

### 5. デプロイ

コードをプッシュすると自動でデプロイが開始されます。

## スクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# リンター実行
npm run lint

# データベースマイグレーション
npm run db:push

# データベースシード実行
npm run db:seed

# Prisma Studio起動
npm run db:studio
```

## プロジェクト構造

```
├── app/                    # Next.js App Router ページ
│   ├── api/               # API Routes
│   ├── auth/              # 認証ページ
│   ├── questions/         # 質問関連ページ
│   └── globals.css        # グローバルスタイル
├── components/            # UIコンポーネント
├── lib/                   # ユーティリティとライブラリ
│   ├── auth.ts           # NextAuth設定
│   ├── prisma.ts         # Prismaクライアント
│   └── translation.ts    # DeepL翻訳クライアント
├── prisma/               # Prismaスキーマとマイグレーション
├── types/                # TypeScript型定義
└── .env.local.example    # 環境変数テンプレート
```

## 注意事項

- DeepL API キーが設定されていない場合、翻訳機能は無効になります
- 開発環境ではSQLiteを使用していますが、本番環境ではPostgreSQLを推奨します
- GitHub OAuthの設定が正しくないと認証機能が動作しません

## ライセンス

MIT License