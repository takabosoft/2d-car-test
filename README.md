# 2D物理エンジンレースカー進化シミュレーター

ブラウザでロボットレースカーが進化しているのを眺めるだけのゲームです。

DEMO:
https://takabosoft.github.io/2d-evolution-racer/

### ソースビルド方法

VSCode + node.jp + npmで動作します。

#### 各ライブラリをインストール（一度のみ）

```
npm install
```

#### 開発時

開発時はバンドラーによる監視とローカルWebサーバーを立ち上げます。

```
npx webpack -w
```

```
npx live-server docs
```

SCSSは拡張機能で[Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass)を利用します。

#### リリース時

```
npx webpack --mode=production
```
