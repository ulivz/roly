import fs from 'fs'
import * as rollup from 'rollup'
import switchy from 'switchy'
import chalk from 'chalk'
import getRollupOptions from './get-rollup-options'
import log from './log'
import {
  cwd,
  isString,
  isArray,
  splitStrByComma,
  handleRollupError,
  joinPath,
  isAbsolutePath
} from './utils'

function readInPkg(file) {
  try {
    const pkg = require(file)
    const roly = pkg.roly || {}
    if (pkg.name && !roly.filename) {
      const { name } = pkg
      roly.filename = name.startsWith('@')
        ? name.slice(name.lastIndexOf('/') + 1)
        : name
    }
    roly.pkg = pkg
    return roly
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return {
        // Ensure pkg in options
        pkg: {}
      }
    }
    throw err
  }
}

function singleRoly(options = {}) {
  return new Promise(resolve => {
    options = Object.assign(
      {
        input: './src/index.js',
        format: ['cjs'],
        outDir: './dist',
        filename: 'index',
        compress: []
      },
      options
    )

    // for backward-compat
    if (options.entry) {
      options.input = options.entry
    }

    // for custom base dir
    const baseDir = options.baseDir
    if (baseDir) {
      if (!isAbsolutePath(options.input)) {
        options.input = joinPath(baseDir, options.input)
      }
      if (!isAbsolutePath(options.outDir)) {
        options.outDir = joinPath(baseDir, options.outDir)
      }
    }

    // Ensure format is an array
    let formats = options.format
    if (isString(formats)) {
      formats = formats === 'all'
        ? ['cjs', 'umd', 'es']
        : splitStrByComma(formats)
    } else if (!isArray(formats)) {
      throw new TypeError('Expect "format" to be a string or Array')
    }

    // Ensure compress is an array
    if (isString(options.compress)) {
      options.compress = splitStrByComma(options.compress)
    } else if (options.compress === true) {
      options.compress = ['cjs', 'umd', 'iife'] // Currently uglifyjs cannot compress es format
    } else if (!isArray(options.compress)) {
      throw new TypeError('Expect "compress" to be a string/true or Array')
    }

    options.compress = options.compress
      .filter(v => formats.includes(v))
      .map(v => `${v}Compress`)

    const allFormats = [...formats, ...options.compress]
    resolve(allFormats)
  }).then(allFormats => {
    return Promise.all(
      allFormats.map(format => {
        const rollupOptions = getRollupOptions(options, format)

        if (options.watch) {
          let init
          const watcher = rollup.watch(rollupOptions)
          return watcher.on('event', event => {
            switchy({
              START() {
                log(format, 'starting', chalk.blue)
                if (!init) {
                  init = true
                }
              },
              BUNDLE_START() {},
              BUNDLE_END() {
                log(format, 'bundled', chalk.green)
              },
              END() {},
              ERROR() {
                handleRollupError(event.error)
              },
              FATAL() {
                handleRollupError(event.error)
              },
              default() {
                console.error('unknown event', event)
              }
            })(event.code)
          })
        }

        return rollup.rollup(rollupOptions).then(bundle => {
          if (options.write === false)
            return bundle.generate(rollupOptions.output)
          return bundle.write(rollupOptions.output)
        })
      })
    ).then(result => {
      return result.reduce((res, next, i) => {
        res[allFormats[i]] = next
        return res
      }, {})
    })
  })
}

export default function roly(options = {}) {
  const baseDir = options.baseDir || ''
  const configFileName = options.config || 'roly.config.js'
  const configFilePath = cwd(joinPath(baseDir, configFileName))

  let rolyConfig = {}
  if (fs.existsSync(configFilePath)) {
    rolyConfig = require(configFilePath)
  }

  const pkgConfig = readInPkg(cwd(joinPath(baseDir, 'package.json')))

  if (Array.isArray(rolyConfig)) {
    return Promise.all(
      rolyConfig.map(rolyOptions => {
        return singleRoly(Object.assign(options, pkgConfig, rolyOptions))
      })
    )
  }
  return singleRoly(Object.assign(options, rolyConfig, pkgConfig))
}
