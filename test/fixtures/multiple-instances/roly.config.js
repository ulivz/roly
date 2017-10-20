module.exports = [
  {
    entry: 'a.js',
    filename: 'moduleA',
    exports: 'named',
    replace: {
      ENV_A: 'env_a'
    }
  },
  {
    entry: 'b.js',
    filename: 'moduleB',
    exports: 'named'
  }
]