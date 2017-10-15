import fs from 'fs'
import { cwd, joinPath } from './utils'

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

// Read => roly.config.js & package.json
export default function(file = 'roly.config.js', baseDir = '') {
  const configFile = cwd(joinPath(baseDir, file))
  const pkgConfig = readInPkg(cwd(joinPath(baseDir, 'package.json')))

  if (fs.existsSync(configFile)) {
    return Object.assign(require(configFile), pkgConfig)
  }
  return pkgConfig
}
