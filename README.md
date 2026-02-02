# リアルタイム翻訳Webアプリ

スマホ向けのリアルタイム翻訳Webアプリケーションです。音声入力とテキスト入力の両方に対応し、リアルタイムで翻訳結果を表示・音声再生できます。

## 🌟 機能

- 📱 **スマホ対応**: レスポンシブデザインで快適なモバイル体験
- 🎤 **音声入力**: Web Speech APIを使用した音声認識
- 💬 **テキスト入力**: 手入力にも対応
- 🔄 **リアルタイム翻訳**: 入力中に自動で翻訳を実行
- 🔊 **音声再生**: 翻訳結果を音声で読み上げ
- 🌐 **多言語翻訳**: 翻訳元/翻訳先を選択

## 🛠️ 技術スタック

### フロントエンド
- React 18
- TypeScript
- Vite
- Web Speech API (音声認識・音声合成)
- Axios

### バックエンド
- Laravel 10
- PHP 8.2

### インフラ
- Docker & Docker Compose
- Nginx
- PHP-FPM

## 📋 必要要件

- Docker Desktop
- Docker Compose
- Git

## 🚀 セットアップ方法

### 1. リポジトリのクローン

```bash
git clone https://github.com/<YOUR_GITHUB>/<YOUR_REPO>.git
cd <YOUR_REPO>
```

### 2. 環境変数の設定

```bash
# バックエンドの環境変数をコピー
cp backend/.env.example backend/.env
```

### 3. Dockerコンテナの起動

```bash
# すべてのコンテナをビルド・起動
docker compose up -d --build
```

### 4. バックエンドのセットアップ

```bash
# PHPコンテナに入る
docker compose exec php bash

# Composerの依存関係をインストール
composer install

# アプリケーションキーを生成
php artisan key:generate

# コンテナから抜ける
exit
```

### 5. フロントエンドのセットアップ

```bash
# フロントエンドコンテナに入る
docker compose exec frontend sh

# 依存関係をインストール
npm install

# コンテナから抜ける
exit
```

### 6. アプリケーションへのアクセス

- **アプリ（Nginx経由）**: http://localhost:8080

## 📱 使い方

### 音声入力で翻訳

1. 🎤マイクボタンをタップ
2. 日本語で話す
3. 自動的にテキスト化され、リアルタイムで英語に翻訳
4. 🔊再生ボタンで翻訳結果を音声で聞く

### テキスト入力で翻訳

1. テキスト欄に日本語を入力
2. 入力中に自動で翻訳が実行される
3. 翻訳結果が下部に表示される

## 🔧 開発

### フロントエンド開発

```bash
cd frontend
npm run dev
```

### バックエンド開発

```bash
cd backend
php artisan serve
```

### コンテナのログ確認

```bash
# すべてのコンテナのログ
docker compose logs -f

# 特定のコンテナのログ
docker compose logs -f frontend
docker compose logs -f php
docker compose logs -f nginx
```

## 🌐 固定URLで公開（Cloudflare Tunnel）

自宅PCでDockerを動かしたまま、固定URL（HTTPS）で公開できます。

- 手順: [CLOUDFLARE_TUNNEL.md](CLOUDFLARE_TUNNEL.md)

## ▲ Vercelで公開（おすすめ）

Vercelの固定URL（HTTPS）で常時公開できます。DB（履歴）は使いません。

### 構成

- フロント: Vite（静的配信）
- API: Vercel Serverless Function（`/api/translate`）

### 手順

1) VercelにリポジトリをImport
2) **Root Directory** を `frontend` に設定
3) Environment Variables に以下を設定
  - `DEEPL_API_KEY`（必須）
  - `DEEPL_API_URL`（任意。未設定なら `https://api-free.deepl.com/v2/translate`）
4) Deploy

デプロイ後は `https://<your-app>.vercel.app` でアクセスできます。

## 🌍 翻訳APIの設定

デフォルトではモック翻訳が動作します。本番環境では以下のいずれかのAPIを設定してください：

### Google Cloud Translation API

1. Google Cloud Consoleでプロジェクトを作成
2. Cloud Translation APIを有効化
3. APIキーを取得
4. `backend/.env`に設定:

```env
TRANSLATION_API_KEY=your-google-api-key
TRANSLATION_API_PROVIDER=google
```

### DeepL API（推奨）

1. DeepL APIのアカウントを作成
2. APIキーを取得
3. `backend/.env`に設定:

```env
TRANSLATION_API_KEY=your-deepl-api-key
TRANSLATION_API_PROVIDER=deepl
```

## 📂 プロジェクト構造

```
translation-prototype/
├── docker/
│   ├── nginx/          # Nginx設定
│   └── php/            # PHP-FPM Dockerfile
├── backend/            # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   └── Models/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   └── config/
├── frontend/           # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── public/
└── docker-compose.yml
```

## 🎯 APIエンドポイント

### 翻訳

```http
POST /api/translate
Content-Type: application/json

{
  "text": "こんにちは",
  "source_lang": "ja",
  "target_lang": "en"
}
```

## 🔍 トラブルシューティング

### 音声認識が動作しない

- HTTPSまたはlocalhostでアクセスしているか確認
- ブラウザがWeb Speech APIをサポートしているか確認（Chrome推奨）
- マイクへのアクセス許可を確認

### 翻訳が動作しない

- バックエンドAPIが起動しているか確認
- ネットワーク設定を確認
- ブラウザのコンソールでエラーを確認

### Dockerコンテナが起動しない

```bash
# コンテナを停止
docker compose down

# ボリュームも削除して再起動
docker compose down -v
docker compose up -d --build
```

## 📝 ライセンス

このプロジェクトは個人開発用です。

## 🤝 貢献

プルリクエストを歓迎します！

## 📧 お問い合わせ

質問や提案がある場合は、Issueを作成してください。
