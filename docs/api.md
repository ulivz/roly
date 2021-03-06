# Node.js API

To use `roly` at your node.js application:

```js
import roly from 'roly'

roly(options).catch(err => {
  if (err.snippet) {
    // display the actual error snippet
    console.error(err.snippet)
  }
  console.error(err.stack)
})
```

<p class="tip">
You node.js version needs to be at least **6**.
</p>

### input

- Type: `string`
- Default: `src/index.js`

Input file.

<p class="tip">
It can a relative path to current process working directory (`process.cwd()`) or `baseDir`, or a pure absolute path.
</p>

### filename

- Type: `string`

The filename of bundled files, the default is package name in `package.json`. If no package.json was found, then fallbacks to `index`.

### format

- Type: `string` or `array`
- Default: `['cjs']`

Specific the bundle format, it could be a string like `'umd'` or multiple targets `['umd', 'cjs']`, it's useful if you want to support multiple standards. Default value is `['cjs']`.

You should specify a `moduleName` if your bundle targets `umd` format, otherwise it will fallback to `filename`.

Here's a shorthand to set `format` to `['cjs', 'es', 'umd']`:

```js
module.exports = {
  format: 'all'
}
```

You can also use comma `,` to separate formats:

```js
module.exports = {
  format: 'cjs,es,umd,iife'
}
```

### outDir

- Type: `string`<br>
- Default: `dist`

Output directory.

### baseDir

- Type: `string`<br>
- Default: `process.cwd()`

Customized base directoy. By default, the option `input` and `outDir` will be resolved as a relative path to current `process.cwd()`, also, including roly's finding `package.json`. but sometimes we want to change the default behavior and don't want to reach it with using `process.chdir()`. it's time to use `baseDir`. for example:

Your are in `/root` (`process.cwd() = '/root'`), and your package is in `/root/mypkg`. entry file is `/root/mypkg/src/main.js`, expected output directory is `/root/mypkg/lib`.

then, you can config like:

```js
module.exports = {
  baseDir: 'mypkg',
  input: 'src/main.js',
  outDir: 'lib'
}
```

<p class="tip">
It is worth noting that when `input` is out of `baseDir` and you still used the `relative` path, entry will not be resolved and error will be throw. absolute paths can be used to solve this problem.
</p>

### compress

- Type: `boolean` `string` `Array`<br>
- Default: `undefined`

Compress specific formats, set it to `true` to compress `cjs` `umd` and `es`, it does not include `es` format because uglifyjs can't parse `es modules`.

It will also automatically generate sourcemaps file when this option is enabled.

### alias

- Type: `object`

This is some feature which is similar to Webpack's `resolve.alias`.

### js

- Type: `string` `boolean`<br>
- Default: `buble`

Load a custom plugin to transpile javascript, eg: `js: 'typescript'` then we load `rollup-plugin-typescript`, and you can configure it via `options.typescript`.

To disable default Buble transformation, you can set it to `false`.

### resolve

- Type: `boolean`<br>
- Default: `undefined`

Resolve external dependencies, it's always `true` in `umd` format.

### commonjs

- Type: `object`<br>
- Default: `{ include: 'node_modules/**' }`

Options for [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs), this plugin is only available in `umd` format or when option `resolve` is `true`. Since it's used to resolve CommonJS dependencies in `node_modules`.

### replace

- Type: `object`

Add options to [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace).

### env

- Type: `object`

Like `replace` option but it replaces strings that start with `process.env.` and automatically stringify the value:

```js
{
  env: {
    NODE_ENV: 'development'
  }
}
```

Then in your file:

```js
const prod = process.env.NODE_ENV === 'production'
// compiled to
const prod = "development" === 'production'
```

### external

- Type: `Array` `Function`

[Exclude files or modules.](https://github.com/rollup/rollup/wiki/JavaScript-API#external)

### paths

- Type: `object`

This helps you import some file from the CDN (as using AMD), or set an alias to an external file, see [more details in Rollup's WIKI](https://github.com/rollup/rollup/wiki/JavaScript-API#paths).

### map

- Type: `boolean`<br>
- Default: `false`

Enable sourcemaps, note that when option `compress` is enabled it will always generate sourcemaps for compressed files.

### flow

- Type: `boolean`<br>
- Default: `undefined`

Remove flow type annotations.

### exports

- Type: `string`<br>
- Default: `auto`

[Specific what export mode to use](https://github.com/rollup/rollup/wiki/JavaScript-API#exports).

### browser

- Type: `boolean`<br>
- Default: `false`

Respect `browser` field in `package.json`

### banner

- Type: `boolean` `string` `object`<br>
- Default: `undefined`

To insert banner, the simplest way is to set `banner: true`,
then we will auto inject fields including
`name`, `version`, `author`, `license`, `year`
from `package.json` into banner:

```js
module.exports = {
  banner: true
}
```

Or provide an object directly:

```js
module.exports = {
  banner: {
    name: 'roly',
    version: '1.0.0',
    author: 'ULIVZ',
    license: 'MIT',
    year: 2016
  }
}
```

The output is like:

```js
/*!
 * roly v1.0.0
 * (c) 2011-present ULIVZ
 * Released under the MIT License.
 */
```

Of course, you can directly use string too:

```js
module.exports = {
  banner: '/* Some kind of credit */'
}
```

### esModules

- Type: `boolean`<br>
- Default: `true`

Respect `jsnext:main` and `module` field in `package.json`

### plugins

- Type: `Array<string>` `Array<plugin>`

Add custom Rollup plugins, for example, to support `.vue` files:

```js
module.exports = {
  plugins: [
    require('rollup-plugin-vue')()
  ]
}
```

Or use string:

```js
module.exports = {
  plugins: ['vue'],
  vue: {} // options for `rollup-plugin-vue`
}
```

Using `string` is handy since you can directly do `roly --plugins vue --vue.css style.css` in CLI without a config file.

### watch

- Type: `boolean`<br>
- Default: `false`

Run Rollup in watch mode, which means you will have faster incremental builds.

### buble

Options for `rollup-plugin-buble`.

#### buble.objectAssign

- Type: `string`<br>
- Default: `Object.assign`

The `Object.assign` that used in object spreading.

#### buble.transforms

- Type: `object`<br>
- Default:

```js
{
  generator: false,
  dangerousForOf: true,
  dangerousTaggedTemplateString: true
}
```

Apply custom transform rules to `buble` options.

#### buble.jsx

- Type: `string`

Buble supports JSX, and you can specific a custom JSX pragma, eg: `h`.


#### buble.async

- Type: `boolean`<br>
- Default: `true`

Transform `async/await` to generator function, defaults to `true`. This is independently using `async-to-gen`.

#### buble.target

- Type: `object`

Set compile targets for buble, eg: `{"chrome": 48, "firefox": 44, "node": 4}`.
