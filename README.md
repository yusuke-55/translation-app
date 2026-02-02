# 翻訳Webアプリ

**「スマホで直感的に使える翻訳アプリ」**をテーマに開発しました。
音声入力・テキスト入力の両方に対応し、
フロントエンド（React）とバックエンド（Laravel）をAPIで分離した構成になっています。

---

## アプリ概要・機能

* **スマホ対応（レスポンシブ）**
* **音声入力**（Web Speech API）
* **テキスト入力**
* **リアルタイム翻訳**
* **翻訳結果の音声再生**
* **翻訳元 / 翻訳先言語の切り替え**

---

## 工夫した点

* 音声入力 → 翻訳 → 音声再生をリアルタイムで連携し、UXを重視
* フロントエンドとバックエンドをAPIで分離し、実務に近い構成を採用
* 翻訳APIを切り替え可能な設計にし、拡張性を意識
* Dockerを使用し、環境構築の再現性を確保
* スマートフォン利用を想定したUI設計

---

## 苦労した点

* Web Speech APIのHTTPS制約・ブラウザ依存への対応
* 音声入力中の状態管理と再レンダリング制御
* Docker環境でのフロントエンド / バックエンド / Nginxの連携設定

---

## 技術スタック

### フロントエンド

* React 18
* TypeScript
* Vite
* Web Speech API
* Axios

### バックエンド

* Laravel 10
* PHP 8.2

### インフラ・開発環境

* Docker / Docker Compose
* Nginx
* PHP-FPM

---

## 動作要件（ローカル開発）

* Docker Desktop
* Docker Compose
* Git

---

## セットアップ（ローカル起動）

```bash
git clone https://github.com/<YOUR_GITHUB>/<YOUR_REPO>.git
cd <YOUR_REPO>
```

### 環境変数の設定

```bash
cp backend/.env.example backend/.env
```

### Docker起動

```bash
docker compose up -d --build
```

### バックエンド初期設定

```bash
docker compose exec php bash
composer install
php artisan key:generate
exit
```

### フロントエンド初期設定

```bash
docker compose exec frontend sh
npm install
exit
```

### アクセス

* [http://localhost:8080](http://localhost:8080)

---

## 使い方

### 音声入力

1. マイクボタンをタップ
2. 音声を入力
3. 自動で翻訳
4. 再生ボタンで音声出力

### テキスト入力

1. テキストを入力
2. 入力中にリアルタイム翻訳
3. 翻訳結果を表示

---

## デプロイ（Vercel）

ポートフォリオ公開用としてVercelでのデプロイに対応しています。

* フロントエンド：Vite（静的配信）
* API：Vercel Serverless Function

### 必須環境変数

* `DEEPL_API_KEY`
* `DEEPL_API_URL`（任意）

---

## 翻訳API設定

### DeepL API（推奨）

```env
TRANSLATION_API_KEY=your-deepl-api-key
TRANSLATION_API_PROVIDER=deepl
```

### Google Translation API

```env
TRANSLATION_API_KEY=your-google-api-key
TRANSLATION_API_PROVIDER=google
```

※ 未設定の場合はモック翻訳が動作します。

---

## ディレクトリ構成

```
translation-app/
├── backend/      # Laravel API
├── frontend/     # React + TypeScript
├── docker/       # Docker設定
└── docker-compose.yml
```

---

## ライセンス

MIT License
