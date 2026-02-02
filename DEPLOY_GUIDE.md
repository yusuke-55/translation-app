# 🚀 Railway.app 簡単デプロイ手順

このガイドに従えば、約15分でスマホから使える翻訳アプリがデプロイできます！

---

## ステップ1: Railway.appのアカウント作成（3分）

1. ブラウザで https://railway.app を開きます
2. 画面右上の「Login」ボタンをクリック
3. 「Login with GitHub」を選択
4. GitHubのログイン画面が表示されたら、ユーザー名とパスワードを入力
5. 「Authorize Railway」ボタンをクリックして認証

✅ Railwayのダッシュボードが表示されたら成功です！

---

## ステップ2: 空のプロジェクトを作成（1分）

1. ダッシュボードで紫色の「New Project」ボタンをクリック
2. 表示されたメニューから「Empty Project」を選択
3. 画面左上のプロジェクト名（「Untitled」など）をクリック
4. わかりやすい名前に変更（例: `translation-app`）
5. Enterキーを押して保存

✅ 空のプロジェクト画面が表示されます

---

## ステップ3: MySQLデータベースを追加（1分）

1. プロジェクト画面中央の「+ New」ボタンをクリック
2. 「Database」を選択
3. 「Add MySQL」をクリック

✅ MySQLのカードが表示され、自動的にセットアップが始まります（1分ほどかかります）

---

## ステップ4: バックエンド（Laravel）をデプロイ（5分）

### 4-1. GitHubリポジトリを接続

1. 再度「+ New」ボタンをクリック
2. 「GitHub Repo」を選択
3. リポジトリ一覧から `translation-prototype` を探してクリック
4. 「Deploy Now」ボタンをクリック

### 4-2. Root Directoryを設定

1. デプロイが始まったら、すぐに「Settings」タブをクリック
2. 「Service」セクションを探す
3. 「Root Directory」の入力欄に `backend` と入力
4. 「Watch Paths」の入力欄に `backend/**` と入力
5. 画面下部の保存は不要（自動保存されます）

### 4-3. 環境変数を設定

1. 「Variables」タブをクリック
2. 「RAW Editor」ボタンをクリック
3. 以下をすべてコピーして貼り付け：

```env
APP_NAME=TranslationApp
APP_ENV=production
APP_KEY=base64:hAUAR2lbwaHAyIihEQL32tD1vIgUvVz00m3rtv72Xbw=
APP_DEBUG=false
APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
DEEPL_API_KEY=f3c00ebb-426c-4710-bea2-c167a666f718:fx
DEEPL_API_URL=https://api-free.deepl.com/v2/translate
SESSION_DRIVER=cookie
CACHE_DRIVER=file
LOG_CHANNEL=stderr
DB_CONNECTION=mysql
DB_HOST=${{MYSQL.MYSQLHOST}}
DB_PORT=${{MYSQL.MYSQLPORT}}
DB_DATABASE=${{MYSQL.MYSQLDATABASE}}
DB_USERNAME=${{MYSQL.MYSQLUSER}}
DB_PASSWORD=${{MYSQL.MYSQLPASSWORD}}
```

4. 「Update Variables」ボタンをクリック

### 4-4. 公開URLを取得

1. 「Settings」タブに戻る
2. 「Networking」セクションまでスクロール
3. 「Generate Domain」ボタンをクリック
   - **ポート番号を聞かれた場合**: そのまま空欄のままで「Generate」をクリック
   - Railwayが自動的にポートを割り当てます（環境変数`$PORT`を使用）
4. 生成されたURL（例: `backend-production-xxxx.up.railway.app`）をコピー

📋 **重要: このURLをメモ帳などに保存してください！次のステップで使います**

✅ デプロイが完了するまで3〜5分待ちます
   - 「Deployments」タブで進行状況を確認できます
   - 緑色のチェックマークが表示されたら完了です

---

## ステップ5: フロントエンド（React）をデプロイ（5分）

### 5-1. フロントエンド用のサービスを追加

1. 画面左上のプロジェクト名をクリックして、プロジェクト画面に戻る
2. 「+ New」ボタンをクリック
3. 「GitHub Repo」を選択
4. 同じ `translation-prototype` リポジトリを選択
5. 「Deploy Now」をクリック

### 5-2. Root Directoryを設定

1. すぐに「Settings」タブをクリック
2. 「Root Directory」に `frontend` と入力
3. 「Watch Paths」に `frontend/**` と入力

### 5-3. 環境変数を設定

1. 「Variables」タブをクリック
2. 「New Variable」ボタンをクリック
3. 以下のように入力：
   - **Variable Name**: `VITE_API_URL`
   - **Value**: `https://バックエンドのURL/api`
     - 例: `https://backend-production-xxxx.up.railway.app/api`
     - ⚠️ 末尾に `/api` を忘れずに！
4. 「Add」ボタンをクリック

### 5-4. 公開URLを取得

1. 「Settings」タブに戻る
2. 「Networking」セクションで「Generate Domain」をクリック
   - **ポート番号を聞かれた場合**: そのまま空欄のままで「Generate」をクリック
3. 生成されたURL（例: `frontend-production-xxxx.up.railway.app`）をコピー

📱 **これがあなたのアプリのURLです！**

✅ デプロイが完了するまで3〜5分待ちます

---

## ステップ6: スマホで動作確認（1分）

1. スマホのブラウザ（Chrome、Safari など）を開く
2. フロントエンドのURLを入力してアクセス
3. 翻訳アプリが表示されます！

### 試してみましょう：

✅ テキスト入力に「こんにちは」と入力 → "Hello" と翻訳される
✅ マイクボタンを押して「今日は良い天気ですね」と話す → 翻訳される
✅ 「人工知能は便利です」と入力 → DeepL APIで翻訳される

---

## トラブルシューティング

### ❌ バックエンドのデプロイが失敗する

**確認ポイント：**
1. 「Deployments」タブでエラーログを確認
2. 「Settings」→「Root Directory」が `backend` になっているか確認
3. 環境変数が正しくコピーできているか確認

**対処法：**
- 「Deployments」タブで「Redeploy」ボタンをクリック

### ❌ フロントエンドで「Translation failed」エラーが出る

**原因：** バックエンドのURLが正しく設定されていない

**対処法：**
1. フロントエンドサービスの「Variables」タブを開く
2. `VITE_API_URL` の値を確認
3. バックエンドのURLの末尾に `/api` があるか確認
   - 正: `https://backend-production-xxxx.up.railway.app/api`
   - 誤: `https://backend-production-xxxx.up.railway.app`

### ❌ CORSエラーが出る

バックエンドの環境変数に以下を追加：
```
CORS_ALLOWED_ORIGINS=https://your-frontend.up.railway.app
```

### ❌ ログを確認したい

1. サービスをクリック
2. 「Deployments」タブを開く
3. 最新のデプロイをクリック
4. 「View Logs」でログが表示されます

---

## 料金について

- **無料プラン**: 月$5分のクレジット
- **このアプリの使用量**: 
  - 1日1〜2時間の利用: 約$1〜2/月
  - 無料枠で十分使えます！
- クレジットカードの登録が必要な場合があります

---

## 次のステップ

🎉 **デプロイ完了おめでとうございます！**

次にできること：
- [ ] 友達にURLをシェアして使ってもらう
- [ ] 他の言語の翻訳機能を追加する
- [ ] デザインをカスタマイズする
- [ ] 翻訳履歴機能を実装する

---

## サポート

問題が解決しない場合は、以下を確認してください：
1. GitHubリポジトリが最新版になっているか
2. Railway側でデプロイが完了しているか（緑のチェックマーク）
3. 環境変数が正しく設定されているか
