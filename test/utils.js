import path from 'path'

export function cwd(filePath) {
  return path.resolve(__dirname, filePath || '')
}

export function Promisify(fn, ...args) {
  return new Promise(resolve => {
    resolve(fn && fn(...args))
  })
}