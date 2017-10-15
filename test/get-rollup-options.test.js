import {Promisify} from './utils'
import getRollupOptions from '../src/get-rollup-options'

describe('get rollup options', () => {
  test('should get correct ouput file name', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        outDir: ''
      },
      'iife'
    ).then(({ output }) => {
      expect(output.file).toBe('roly.iife.js')
    })
  })

  test('should load default plugins', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        outDir: ''
      },
      'iife'
    ).then(({ plugins }) => {
      expect(plugins.length).toBe(3)
      expect(plugins.some(plugin => plugin.name === 'json')).toBe(true)
      expect(plugins.some(plugin => plugin.name === 'async-to-gen')).toBe(true)
      expect(plugins.some(plugin => plugin.name === 'buble')).toBe(true)
    })
  })

  test('flow plugin', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        flow: true,
        outDir: ''
      },
      'iife'
    ).then(({ plugins }) => {
      expect(plugins.some(plugin => plugin.name === 'flow-remove-types')).toBe(
        true
      )
    })
  })

  test('should throw error when not found plugin', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        plugins: 'vue',
        outDir: ''
      },
      'iife'
    ).catch(error => {
      expect(error.code).toBe('MODULE_NOT_FOUND')
    })
  })

  test('should avoid to load built-in plugin', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        plugins: ['commonjs', require('rollup-plugin-node-resolve')],
        outDir: ''
      },
      'iife'
    ).then(({ plugins }) => {
      expect(plugins.some(plugin => plugin.name === 'commonjs')).toBe(true)
      expect(plugins.some(plugin => plugin.name === 'nodeResolve')).toBe(true)
    })
  })

  test('should throw error when not found js target plugin', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        js: 'rolyscript',
        outDir: ''
      },
      'iife'
    ).catch(error => {
      expect(error.code).toBe('MODULE_NOT_FOUND')
    })
  })

  test('should load "alias" plugin when giving "alias"', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        alias: {
          ulivz: 'ULIVZ'
        },
        outDir: ''
      },
      'iife'
    ).then(({ plugins }) => {
      expect(plugins.some(plugin => plugin.resolveId)).toBe(true)
    })
  })

  test('should load "replace" plugin when giving "env"', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        env: {
          NODE_ENV: 'development'
        },
        outDir: ''
      },
      'iife'
    ).then(({ plugins }) => {
      expect(plugins.some(plugin => plugin.name === 'replace')).toBe(true)
    })
  })

  test('should throw error when getting a non-string name value', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        banner: {
          name: ['ulivz']
        },
        outDir: ''
      },
      'iife'
    ).catch(error => {
      expect(error.message).toBe(
        'Expect "name" in package.json to be a string but got object.'
      )
    })
  })

  test('should get correct name when giving moduleName', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        moduleName: 'roly',
        outDir: ''
      },
      'iife'
    ).then(({ output }) => {
      expect(output.name).toBe('roly')
    })
  })

  test('should only load specified plugin when giving a Function-typed plugin', () => {
    return Promisify(
      getRollupOptions,
      {
        filename: 'roly',
        plugins: require('rollup-plugin-node-resolve'),
        outDir: ''
      },
      'iife'
    ).then(({ plugins }) => {
      expect(Object.prototype.toString.call(plugins)).toBe('[object Object]')
      expect(plugins.name).toBe('node-resolve')
    })
  })
})
