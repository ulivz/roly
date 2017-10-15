import log from '../src/log'
import chalk from 'chalk'

describe('log', () => {
  test('should log with color', () => {
    expect(log('info', 'log', chalk.red)).toBeUndefined()
  })

  test('should log without color', () => {
    expect(log('info', 'log')).toBeUndefined()
  })
})