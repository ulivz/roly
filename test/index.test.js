import rm from 'rimraf'
import chalk from 'chalk'
import roly from '../src/roly'
import {handleRollupError} from '../src/utils'
import {cwd} from './utils'

const prevCwd = process.cwd()
beforeAll(() => {
  process.chdir(__dirname)
})
afterAll(() => {
  rm.sync(cwd('dist*'))
  process.chdir(prevCwd)
})

describe('index', () => {

  test('use typescript', async () => {
    const { cjs } = await roly({
      entry: cwd('fixtures/index.ts'),
      js: 'typescript',
      write: false
    })
    expect(cjs.code).toMatchSnapshot()
  })

  test('ignore js plugin', async () => {
    const { cjs } = await roly({
      entry: cwd('fixtures/remain.js'),
      js: false,
      write: false
    })
    expect(cjs.code).toMatchSnapshot()
  })

  test('custom buble options', async () => {
    const { cjs } = await roly({
      entry: cwd('fixtures/buble-options.js'),
      buble: {
        objectAssign: 'sign'
      },
      write: false
    })
    expect(cjs.code).toMatchSnapshot()
  })

  test('should handle rollup error', () => {
    handleRollupError({
      plugin: 'rollup',
      message: 'error',
      id: 1,
      snippet: 'error'
    })
    expect(process.exitCode).toBe(1)
    process.exitCode = 0
  })
})
