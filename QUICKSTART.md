# 🚀 クイックスタートガイド

## 最短でアプリを起動する方法

### Windows

1. PowerShellまたはコマンドプロンプトを開く
2. プロジェクトディレクトリに移動
3. セットアップスクリプトを実行:

```cmd
setup.bat
```

### Mac/Linux

1. ターミナルを開く
2. プロジェクトディレクトリに移動
3. セットアップスクリプトに実行権限を付与:

```bash
chmod +x setup.sh
```

4. セットアップスクリプトを実行:

```bash
./setup.sh
```

## 手動セットアップ

### 1. 環境変数ファイルの準備

```bash
cp backend/.env.example backend/.env
```

### 2. Dockerコンテナの起動

```bash
docker-compose up -d --build
```

### 3. バックエンドのセットアップ

```bash
# Composerパッケージのインストール
docker-compose exec php composer install

# アプリケーションキーの生成
docker-compose exec php php artisan key:generate

# データベースマイグレーション
docker-compose exec php php artisan migrate
```

### 4. フロントエンドのセットアップ

```bash
# npmパッケージのインストール
docker-compose exec frontend npm install
```

### 5. アプリケーションへのアクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost/api

## よくあるコマンド

### コンテナの管理

```bash
# コンテナの起動
docker-compose up -d

# コンテナの停止
docker-compose down

# コンテナの再起動
docker-compose restart

# コンテナのログ確認
docker-compose logs -f
```

### Laravel Artisanコマンド

```bash
# マイグレーション
docker-compose exec php php artisan migrate

# マイグレーションのロールバック
docker-compose exec php php artisan migrate:rollback

# キャッシュのクリア
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan config:clear
```

### データベース

```bash
# MySQLコンテナに接続
docker-compose exec mysql mysql -u translation_user -ptranslation_password translation_db
```

## トラブルシューティング

### ポートが既に使用されている

エラー: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**解決方法**:
```bash
# 使用しているプロセスを確認
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000

# docker-compose.ymlでポートを変更するか、使用中のプロセスを停止
```

### コンテナが起動しない

```bash
# すべてのコンテナとボリュームを削除して再起動
docker-compose down -v
docker-compose up -d --build
```

### パーミッションエラー (Mac/Linux)

```bash
# Laravelのストレージディレクトリに書き込み権限を付与
sudo chmod -R 777 backend/storage
sudo chmod -R 777 backend/bootstrap/cache
```

## 開発モード

### フロントエンドの開発サーバー

フロントエンドはすでに開発モードで起動しています（http://localhost:3000）。
ファイルを編集すると自動的にリロードされます。

### バックエンドのデバッグ

`backend/.env`で`APP_DEBUG=true`に設定すると、詳細なエラーメッセージが表示されます。

## 次のステップ

1. 翻訳APIキーの設定（README.mdを参照）
2. 言語設定のカスタマイズ
3. UIのカスタマイズ

詳細は[README.md](README.md)をご覧ください。
