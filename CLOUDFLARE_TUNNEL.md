# Cloudflare Tunnel（固定URL）で常時公開する

このプロジェクトは「自宅PCのDockerで動かしつつ、Cloudflare Tunnelで固定URLを公開」できます。

- 外部からの接続は **Cloudflareへのアウトバウンド通信**のみ（ルータのポート開放不要）
- 公開URLは **HTTPS** になるので、スマホでもマイク利用が通りやすいです
- 注意: 自宅PCがスリープ/電源OFFだと当然止まります（"常時"＝PC稼働中は常時）

## 前提

- Cloudflareアカウント
- Cloudflareで管理しているドメイン（例: `example.com`）
- Windowsに `cloudflared` をインストール（トンネル作成・DNS設定で使います）

インストール例（どちらか）:

- `winget install Cloudflare.cloudflared`
- 公式: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

## 1) ローカルでアプリを起動

このリポジトリのルートで:

- `docker compose up -d --build`

確認:
- `http://localhost:8080`

## 2) Cloudflareにログイン

- `cloudflared login`

ブラウザが開くので、Cloudflareにログインしてドメインを選択します。

## 3) トンネル作成（固定URLの器）

- `cloudflared tunnel create translation-prototype`

成功すると、トンネルUUID（例: `1234...abcd`）と、
`%USERPROFILE%\.cloudflared\<UUID>.json` のような **認証ファイル** が作られます。

## 4) 認証ファイルをプロジェクトに配置

- `%USERPROFILE%\.cloudflared\<UUID>.json` を
  `./cloudflare/<UUID>.json` にコピーします。

## 5) config.ymlを作成

- `./cloudflare/config.yml.example` を `./cloudflare/config.yml` にコピー
- 以下を自分の値で埋めます
  - `<YOUR_TUNNEL_UUID>` → さきほどのUUID
  - `app.example.com` → 使いたい固定URL（サブドメイン）

このプロジェクトはDocker内で `cloudflared` を動かすため、
`service` は `http://nginx:80` になっています（`localhost` ではありません）。

## 6) DNSルーティング（固定URLをトンネルへ紐付け）

例: `app.example.com` を `translation-prototype` に紐付け

- `cloudflared tunnel route dns translation-prototype app.example.com`

## 7) Tunnelを起動（Docker）

- `docker compose --profile tunnel up -d`

停止:
- `docker compose --profile tunnel stop cloudflared`

## 8) 動作確認

スマホ/PCから以下にアクセス:
- `https://app.example.com`

### よくある詰まり

- 404になる: `./cloudflare/config.yml` の `hostname` が違う、またはDNS route未作成
- つながらない: PCがスリープしている、Dockerが止まっている
- 音声入力が動かない: iOS/ブラウザ設定や権限。HTTPSでも許可が必要です

## セキュリティ注意

- `./cloudflare/<UUID>.json` は秘密情報です。Gitにコミットしないでください。
  このリポジトリでは `.gitignore` で除外しています。
