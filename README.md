# iTL 1F Map

iTL 1F Map は、中央大学市ヶ谷田町キャンパスの地図アプリです。Leaflet を使用して SVG ベースの地図を表示し、ユーザーが位置を指定してシェアできる機能を提供します。

## サイト

https://itl-1f-map.vercel.app/

## 機能

- 地図上のクリックでピンを配置
- 位置情報を含む画像を生成してシェア
- URL パラメータによる位置共有
- レスポンシブデザイン

## 使用方法

1. 地図上でクリックしてピンを配置します。
2. 「シェア」ボタンが表示されます。
3. ボタンをクリックして、位置情報付きの画像を生成し、シェアします。
4. URL に位置パラメータが追加され、リンク共有も可能です。

## 技術スタック

- HTML
- CSS
- JavaScript
- Leaflet (地図ライブラリ)

## ファイル構造

```
itl-1f-map/
├── index.html
├── script.js                  # 地図の初期化、ピン配置、シェア機能の実装
├── style.css
├── assets/
│   ├── map.svg
│   ├── pin.svg
│   ├── share.svg
│   ├── favicon.svg
│   └── apple-touch-icon.png   # Appleデバイスでのホーム画面アイコン
├── README.md
├── favicon.ico
└── .prettierc                 # Prettierのコードフォーマット設定ファイル
```

