# DeepL API セットアップガイド

## DeepL APIキーの取得方法

1. **DeepLアカウントの作成**
   - https://www.deepl.com/pro-api にアクセス
   - 「無料で試す」ボタンをクリック
   - アカウント情報を入力して登録

2. **APIキーの取得**
   - ログイン後、アカウント設定に移動
   - 「API Keys」セクションでAPIキーを確認
   - 無料プラン: 月50万文字まで無料

3. **APIキーの設定**
   - `backend/.env` ファイルを開く
   - `DEEPL_API_KEY=your_deepl_api_key_here` を実際のAPIキーに置き換える
   
   ```env
   DEEPL_API_KEY=あなたのAPIキー
   DEEPL_API_URL=https://api-free.deepl.com/v2/translate
   ```

4. **有料プランの場合**
   - `DEEPL_API_URL` を以下に変更：
   ```env
   DEEPL_API_URL=https://api.deepl.com/v2/translate
   ```

## 翻訳の動作

### 辞書ベースの翻訳（優先）
以下の単語/フレーズは辞書から即座に翻訳されます：
- こんにちは → Hello
- ありがとう → Thank you
- これはペンです → This is a pen
- など25個以上のフレーズ

### DeepL APIによる翻訳
辞書にない文章は自動的にDeepL APIを使用して翻訳されます。

## テスト方法

```bash
# コンテナを再起動
docker-compose restart php

# APIテスト
curl -X POST http://localhost:8080/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"今日は良い天気ですね","source_lang":"ja","target_lang":"en"}'
```

## エラーハンドリング

- APIキーが未設定の場合: エラーメッセージを返します
- DeepL APIエラー: ログに記録し、エラーレスポンスを返します
- ネットワークエラー: タイムアウト（10秒）後にエラーを返します

## 対応言語

- 日本語 (ja)
- 英語 (en)
- 中国語 (zh)
- ドイツ語 (de)
- フランス語 (fr)
- スペイン語 (es)
- イタリア語 (it)
- ポルトガル語 (pt)
- ロシア語 (ru)
- 韓国語 (ko)
