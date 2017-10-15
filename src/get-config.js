import fs from 'fs'
import { cwd, resolvepath } from './utils'

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
export default function(file = 'roly.config.js', userCwd = process.cwd()) {
  let rolyConfig
  let cwdConfig
  let pkgConfig = readInPkg(resolvepath(userCwd, 'package.json'))

  if (fs.existsSync(file)) {
    // absolute path
    rolyConfig = file
  } else if (fs.existsSync((cwdConfig = cwd(file)))) {
    // relative path
    rolyConfig = cwdConfig
  } else {
    return pkgConfig
  }

  rolyConfig = require(rolyConfig)

  if (userCwd) {
    pkgConfig = readInPkg(resolvepath(userCwd, 'package.json'))
  }

  return Object.assign(rolyConfig, pkgConfig)
}
