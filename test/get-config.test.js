import getConfig from '../src/get-config'
import {cwd} from './utils'

const prevCwd = process.cwd()
beforeAll(() => {
  process.chdir(__dirname)
})
afterAll(() => {
  rm.sync(cwd('dist*'))
  process.chdir(prevCwd)
})

test('should get correct package config', () => {
  const pkgConfig = getConfig(cwd('fixtures/roly.config.js'))
  expect(pkgConfig.name).toBe('ULIVZ')
  expect(typeof pkgConfig.pkg).toBe('object')
  expect(JSON.stringify(pkgConfig.pkg)).toBe('{}')
})