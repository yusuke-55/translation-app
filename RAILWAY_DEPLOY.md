# Railway.app デプロイガイド

## ステップ1: Railway.appアカウント作成

1. https://railway.app にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでログイン

## ステップ2: プロジェクトのデプロイ

### 2-1. MySQLサービスの追加
1. 「+ New」→「Database」→「Add MySQL」をクリック
2. データベースが作成されます（自動的に接続情報が生成されます）

### 2-2. Laravelバックエンドのデプロイ
1. 「+ New」→「GitHub Repo」を選択
2. あなたのリポジトリを選択
3. 「Add variables」で以下の環境変数を設定：

```
APP_NAME=TranslationApp
APP_ENV=production
APP_KEY=base64:hAUAR2lbwaHAyIihEQL32tD1vIgUvVz00m3rtv72Xbw=
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=mysql
DB_HOST=${{MYSQL.MYSQLHOST}}
DB_PORT=${{MYSQL.MYSQLPORT}}
DB_DATABASE=${{MYSQL.MYSQLDATABASE}}
DB_USERNAME=${{MYSQL.MYSQLUSER}}
DB_PASSWORD=${{MYSQL.MYSQLPASSWORD}}

DEEPL_API_KEY=f3c00ebb-426c-4710-bea2-c167a666f718:fx
DEEPL_API_URL=https://api-free.deepl.com/v2/translate

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

4. Settings → Networking → 「Generate Domain」をクリックしてURLを取得

### 2-3. Reactフロントエンドのデプロイ
1. 同じプロジェクト内で「+ New」→「GitHub Repo」
2. 同じリポジトリを選択
3. Settings → 「Root Directory」を `/frontend` に設定
4. 「Add variables」で環境変数を設定：

```
VITE_API_URL=https://あなたのバックエンドURL/api
```

5. Settings → Networking → 「Generate Domain」をクリック

## ステップ3: デプロイコマンドの設定

各サービスで「Settings」→「Deploy」から以下を設定：

### バックエンド (PHP)
- Build Command: 留空（Dockerfileを使用）
- Start Command: 留空（Dockerfileを使用）

### フロントエンド
- Build Command: `npm install && npm run build`
- Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`

## ステップ4: デプロイ

すべての設定が完了したら、Railwayが自動的にデプロイを開始します。

## アクセス

- フロントエンドURL: `https://your-frontend.up.railway.app`
- バックエンドURL: `https://your-backend.up.railway.app`

スマホから上記のフロントエンドURLにアクセスして動作確認してください！

## トラブルシューティング

### デプロイが失敗する場合
1. Railwayのログを確認
2. 環境変数が正しく設定されているか確認
3. データベース接続情報が正しいか確認

### CORSエラーが出る場合
バックエンドの環境変数に追加：
```
FRONTEND_URL=https://your-frontend.up.railway.app
```
