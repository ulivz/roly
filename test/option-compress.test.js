import {cwd} from './utils'
import roly from '../src/roly'

describe('compress', () => {
  it('true', async () => {
    const { umd, cjs, umdCompress, cjsCompress } = await roly({
      entry: cwd('fixtures/compress.js'),
      format: 'umd,cjs',
      compress: true,
      write: false
    })
    expect(umd.code).toMatchSnapshot()
    expect(cjs.code).toMatchSnapshot()
    expect(umdCompress.code).toMatchSnapshot()
    expect(cjsCompress.code).toMatchSnapshot()
  })

  it('string', async () => {
    const { umd, cjs, cjsCompress } = await roly({
      entry: cwd('fixtures/compress.js'),
      format: 'umd,cjs',
      compress: 'cjs',
      write: false
    })
    expect(umd.code).toMatchSnapshot()
    expect(cjs.code).toMatchSnapshot()
    expect(cjsCompress.code).toMatchSnapshot()
  })
})