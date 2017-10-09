<p align="center">
<img src="https://raw.githubusercontent.com/ulivz/roly/master/logo.png" width="700" height="" style=""/>
</p>

<p align="center">
<a href="https://npmjs.com/package/roly"><img src="https://img.shields.io/npm/v/roly.svg?style=flat-square" alt="NPM version"></a>
<a href="https://npmjs.com/package/roly"><img src="https://img.shields.io/npm/dm/roly.svg?style=flat-square" alt="NPM downloads"></a>
<a href="https://circleci.com/gh/egoist/roly/tree/master"><img src="https://img.shields.io/circleci/project/egoist/roly/master.svg?style=flat-square"></a>
<a href="https://codecov.io/gh/egoist/roly"><img src="https://img.shields.io/codecov/c/github/egoist/roly.svg?style=flat-square"></a>
<a href="https://github.com/egoist/donate"><img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat-square" alt="donate"></a>
</p>

## Introduction

_Running command `roly` it will compile `src/index.js` to:_

```bash
dist/[name].common.js   # commonjs format
```

_The `[name]` is `name` in `package.json` or `index` as fallback._

_You can also generate UMD bundle and compress it with: `roly --format umd --compress umd`, then you get:_

```bash
dist/[name].js          # umd format
dist/[name].min.js      # compressed umd format
dist/[name].min.js.map  # compressed file will automatically get sourcemaps
```

_Not enough? You can have them all in one command `roly --format cjs,es,umd --compress umd`:_

```bash
dist/[name].js          # umd format
dist/[name].min.js      # umd format and compressed
dist/[name].min.js.map  # sourcemap for umd format
dist/[name].common.js   # commonjs format
dist/[name].es.js       # es-modules format
```

**Note:** In `UMD` format all third-party libraries will be bundled in dist files, while in other formats they are excluded.

## Install

```bash
npm install -g roly
# prefer local install
npm install roly --save-dev
```

[Dive into the documentation](http://www.v2js.com/roly/) if you are ready to bundle!

## FAQ

### Why not use Rollup's `targets` option?

As per Rollup [Command Line Interface](https://rollupjs.org/#command-line-reference):

```js
import buble from 'rollup-plugin-buble'

export default {
  input: 'src/main.js',
  plugins: [ buble() ],
  output: [
    { file: 'dist/bundle.cjs.js', format: 'cjs' },
    { file: 'dist/bundle.umd.js', format: 'umd' },
    { file: 'dist/bundle.es.js', format: 'es' },
  ]
}
```

You can use an array as `targets` to generate bundles in multiple formats, which is really neat and helpful.

However, you can't apply different plugins to different target, which means you still need more config files. For example, add `rollup-plugin-node-resolve` and `rollup-plugin-commonjs` in `umd` build, and what about minification? It's yet another config file.

While in roly, it's as simple as running:

```bash
roly src/main.js --format cjs --format umd --format es --compress umd
```

Everything can be done via CLI options, if it's too long to read, you can keep them in `roly` field in `package.json`:

```js
{
  "roly": {
    "entry": "src/main.js",
    "format": ["cjs", "umd", "es"],
    "compress": "umd"
  }
}
```

## License

MIT © [ULIVZ](https://github.com/ulivz)
