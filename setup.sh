#!/bin/bash

echo "🚀 リアルタイム翻訳アプリのセットアップを開始します..."

# バックエンドの.envファイルを作成
if [ ! -f backend/.env ]; then
    echo "📝 backend/.envファイルを作成中..."
    cp backend/.env.example backend/.env
else
    echo "✅ backend/.envファイルは既に存在します"
fi

# Dockerコンテナをビルド・起動
echo "🐳 Dockerコンテナをビルド・起動中..."
docker-compose up -d --build

# PHPコンテナが起動するまで待機
echo "⏳ コンテナの起動を待機中..."
sleep 10

# Composerの依存関係をインストール
echo "📦 Composerの依存関係をインストール中..."
docker-compose exec -T php composer install

# アプリケーションキーを生成
echo "🔑 アプリケーションキーを生成中..."
docker-compose exec -T php php artisan key:generate

# データベースマイグレーション
echo "🗄️  データベースマイグレーション実行中..."
docker-compose exec -T php php artisan migrate --force

# フロントエンドの依存関係をインストール
echo "📦 フロントエンドの依存関係をインストール中..."
docker-compose exec -T frontend npm install

echo ""
echo "✅ セットアップが完了しました！"
echo ""
echo "🌐 アプリケーションへのアクセス:"
echo "   フロントエンド: http://localhost:3000"
echo "   バックエンドAPI: http://localhost/api"
echo ""
echo "📝 ログを確認: docker-compose logs -f"
echo "🛑 停止: docker-compose down"
echo ""
