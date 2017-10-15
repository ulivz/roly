import path from 'path'
import fs from 'fs-extra'
import switchy from 'switchy'
import {EventEmitter} from 'events'
import {cwd} from './utils'
import roly from '../src/roly'

const prevCwd = process.cwd()

beforeAll(() => {
  process.chdir(__dirname)
})

afterAll(() => {
  process.chdir(prevCwd)
})

describe('roly', () => {

  test('it throws because entry not found', () => {
    return roly().catch(err => {
      expect(err.message).toEqual('Could not resolve entry (./src/index.js)')
    })
  })

  /**
   * When package.json's name === @name/package-name, then module's file name === package-name
   */
  test('it should remove the name prefix from a scoped package name', async () => {
    await roly({
      baseDir: 'fixtures/scoped',
      entry: cwd('fixtures/entry.js'),
      exports: 'named',
      outDir: 'dist'
    })
    const files = await fs.readdir(cwd(`fixtures/scoped/dist`))
    expect(files).toEqual(['package-name.common.js'])
  })

  /**
   * When package's name and roly.filename exist at the same time, use roly.filename
   */
  test('it should use the roly.filename', async () => {
    await roly({
      baseDir: 'fixtures/filename',
      entry: cwd('fixtures/entry.js'),
      exports: 'named',
      outDir: 'dist'
    })
    const files = await fs.readdir(cwd(`fixtures/filename/dist`))
    expect(files).toEqual(['roly.common.js'])
  })

  test('should generate all bundles', async () => {
    const result = await roly({
      entry: 'fixtures/entry.js',
      format: 'all',
      exports: 'named',
      write: false
    })
    expect(Object.keys(result)).toHaveLength(3)
  })

  test('it replaces string using rollup-plugin-replace', async () => {
    const { cjs } = await roly({
      entry: 'fixtures/entry.js',
      exports: 'named',
      replace: {
        __VERSION__: '0.0.0'
      },
      write: false
    })
    expect(cjs.code).toMatchSnapshot()
  })

  test('should throw error when "format" is neither string nor array', () => {
    return roly({ format: null }).catch(err => {
      expect(err.message).toEqual('Expect "format" to be a string or Array')
    })
  })

  test('should throw error when "compress" is neither string/true nor array', () => {
    return roly({ compress: null }).catch(err => {
      expect(err.message).toEqual('Expect "compress" to be a string/true or Array')
    })
  })

  test('should work on watch mode', async () => {
    const watchers = await roly({
      entry: 'fixtures/entry.js',
      exports: 'named',
      watch: true
    })
    Object.keys(watchers).forEach(format => {
      const watcher = watchers[format]
      expect(watcher instanceof EventEmitter).toBeTruthy()
      watcher.on('event', event => {
        switchy({
          ERROR() {
            expect(process.exitCode).toEqual(1)
            process.exitCode = 0
          },
          FATAL() {
            expect(process.exitCode).toEqual(1)
            process.exitCode = 0
          }
        })(event.code)
      })
      watcher.emit('event', { code: 'START' })
      watcher.emit('event', { code: 'BUNDLE_END' })

      watcher.emit('event', { code: 'ERROR', error: 'error' })
      watcher.emit('event', { code: 'FATAL', error: 'error' })
      watcher.emit('event', { code: 'ULIVZ' })
      setImmediate(() => {
        watcher.close()
      })
    })
  })
})


describe('option - banner', () => {
  test('banner option = Boolean', async () => {
    const es = await roly({
      baseDir: 'fixtures/banner', // custom the working directory
      entry: cwd('fixtures/entry.js'),
      format: 'es',
      exports: 'named',
      banner: true // banner info from package.json
    })
    expect(es.code).toMatchSnapshot()

  })

  test('banner option = Object', async () => {
    const { cjs } = await roly({
      entry: 'fixtures/entry.js',
      format: 'cjs',
      exports: 'named',
      banner: {
        name: 'roly',
        version: '5.2.0',
        author: 'ulivz',
        license: 'MIT'
      },
      write: false
    })
    expect(cjs.code).toMatchSnapshot()
  })

  test('banner option = String', async () => {
    const { umd, umdCompress } = await roly({
      entry: 'fixtures/entry.js',
      format: 'umd',
      compress: true,
      exports: 'named',
      write: false,
      banner: '/*! rolyroly */'
    })
    expect(umd.code).toMatchSnapshot()
    expect(umdCompress.code).toMatchSnapshot()
  })

})