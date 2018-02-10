const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const opensubtitles = require('../../src/providers/opensubtitles')

const TIMEOUT_IN_MS = 30000

describe('opensubtitles', () => {
  describe('#getSubtitlesByHash', () => {
    it('should find "I Origins" subtitles', async () => {
      const movieHash = 'df2273eb4d8adad44d870f553d3b8788'
      const testfile = path.resolve(__dirname, 'resources/I Origins.srt')

      const expectedSrt = await fs.readFileAsync(testfile, 'utf-8')
      const actualSrt = await opensubtitles.getSubtitlesByHash(movieHash)

      expect(actualSrt).toBe(expectedSrt)
    }, TIMEOUT_IN_MS)

    it('should fail on a bad hash', async () => {
      const badHash = 'lolz-i-dont-exist'

      await expect(opensubtitles.getSubtitlesByHash(badHash)).rejects.toThrow()
    }, TIMEOUT_IN_MS)
  })
})
