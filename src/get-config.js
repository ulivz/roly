import fs from 'fs'
import { cwd } from './utils'

function readInPkg(file) {
  try {
    const pkg = require(file)
    const roly = pkg.roly || {}
    if (pkg.name) {
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

// Read => roly.config.js & package.json
export default function (file = 'roly.config.js') {
  let config, cwdConfig
  const pkgConfig = readInPkg(cwd('package.json'))
  console.log(fs.existsSync(file))
  if (fs.existsSync(file)) { // absolute path
    console.log('XXXX')
    config = file
  } else if (cwdConfig = fs.existsSync(cwd(file))) { // relative path
    config = cwdConfig
  } else {
    return pkgConfig
  }
  return Object.assign(require(config), pkgConfig)
}
