/* eslint-disable unicorn/no-process-exit */
import cac from 'cac'
import update from 'update-notifier'
import roly from './roly'
import { handleRollupError } from './utils'

const cli = cac()

update({ pkg: cli.pkg }).notify()

cli.command('*', 'Bundle with roly', (input, flags) => {
  const options = Object.assign(
    {
      input: input[0]
    },
    flags
  )

  return roly(options).catch(err => {
    handleRollupError(err)
  })
})

cli
  .option('config', {
    desc: 'Path to config file',
    alias: 'c'
  })
  .option('watch', {
    desc: 'Run in watch mode',
    alias: 'w'
  })
  .option('filename', {
    desc: 'The filename of output file, no extension',
    alias: 'n'
  })
  .option('out-dir', {
    desc: 'The output directory',
    alias: 'd'
  })
  .option(
    'base-dir',
    "Customized base directory, default is './', should be a relative path"
  )
  .option('format', 'Bundle format, array of string')
  .option('module-name', 'The module name for UMD builds')
  .option('map', 'Generate sourcemap, boolean or `inline`')
  .option('compress', 'Generate a UMD bundle and compress it with sourcemaps')
  .option(
    'skip',
    'Exclude specfic modules in node_modules dir from bundled file'
  )
  .option(
    'es-module',
    'Respect `jsnext:main` and `module` field in package.json'
  )
  .option('browser', 'Respect `browser` field in package.json')
  .option('alias', 'Set option for rollup-plugin-alias')
  .option('replace', 'Set option for rollup-plugin-replace')
  .option('flow', 'Remove flow type annotations')
  .option('exports', 'Specific what export mode to use, `default` or `named`')
  .option('resolve', 'Resolve external dependencies')
  .option(
    'banner',
    'Content to insert to the top of bundle file, boolean or string or object'
  )

cli.parse()
