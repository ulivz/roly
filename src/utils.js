/* eslint-disable import/prefer-default-export */
import path from 'path'
import chalk from 'chalk'
import log from './log'

/**
 * Array type check
 */
export function isArray(arr) {
  return Array.isArray(arr)
}

/**
 * String type check
 */
export function isString(str) {
  return typeof str === 'string'
}

/**
 * Shorthand to get the abosulte path relative
 * to current process working directory
 */
export function cwd(...args) {
  return path.resolve(process.cwd(), ...args)
}

/**
 * String type check
 */
export function splitStrByComma(str) {
  return str.split(',').map(item => item.trim())
}

/**
 * path
 */
export const joinPath = path.join
export const isAbsolutePath = path.isAbsolute

/**
 * Handle rollup error
 */
export function handleRollupError(error) {
  console.log('123213')
  log(error.plugin || 'error', error.message, chalk.red)
  if (error.id) {
    console.log(chalk.dim(`Location: ${error.id}`))
  }
  console.error(error.snippet || error)
  console.log()
  process.exitCode = 1
}
