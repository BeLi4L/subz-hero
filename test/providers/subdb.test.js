const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const subdb = require('../../src/providers/subdb')

describe('subdb', () => {
  describe('#getSubtitlesByHash', () => {
    it('should find "I Origins" subtitles', async () => {
      const movieHash = 'df2273eb4d8adad44d870f553d3b8788'
      const testfile = path.resolve(__dirname, 'expected.srt')

      const expectedSrt = await fs.readFileAsync(testfile, 'utf-8')
      const actualSrt = await subdb.getSubtitlesByHash(movieHash)

      expect(actualSrt).toBe(expectedSrt)
    })

    it('should fail on a bad hash', async () => {
      const badHash = 'lolz-i-dont-exist'

      await expect(subdb.getSubtitlesByHash(badHash)).rejects.toThrow()
    })
  })
})
