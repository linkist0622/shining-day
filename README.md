# SHINING DAY

善福寺から、地域で支え合う日常をつくる。構想紹介サイトの公開用コードです。

## 公開設定

- 接続予定ドメイン：`shining-day.com`
- Framework Preset：Other（`vercel.json`の`framework: null`）
- Install Command：`npm ci`
- Build Command：`npm run build`
- Output Directory：`dist`

`dist`内のHTML・CSS・JavaScriptを直接配信します。Viteは開発用です。

## ローカル確認

Node.js 22.12以降を使用します。

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

表示されたURLを開きます。`npm run build`はローカル参照・アンカー・JavaScript構文・Vercel設定を検証します。

## ドメイン接続

Vercelの対象プロジェクトのSettings → Domainsへ`shining-day.com`と`www.shining-day.com`を追加し、後者から前者へのリダイレクトを設定します。お名前.comのDNSに入力する値は、Vercelが対象プロジェクトに表示する値を使用してください。ドメインの移管は不要です。

現時点ではVercelプロジェクトの作成・デプロイ・ドメイン検証は未完了です。検索掲載は`noindex,nofollow`を維持しており、独自ドメインと閲覧範囲の確認後に掲載方針に合わせて変更します。noindexは閲覧制限の機能ではありません。

## 素材と内容

人物・場面はSHINING DAY用に生成した架空の構想イラストで、実在の利用者・職員・施設を示しません。フォントはGoogle FontsのNoto Sans JPをサブセット化して使用し、SIL Open Font Licenseを`dist/assets/OFL-NotoSansJP.txt`に同梱しています。

正式なサービス条件は検討中です。利用申込み・採用応募・データ送信機能はまだ設けていません。
