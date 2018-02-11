const fs = require('fs-extra')
const path = require('path')
const opensubtitles = require('../../src/providers/opensubtitles')

const TIMEOUT_IN_MS = 30000

describe('opensubtitles', () => {
  describe('#getSubtitlesByHash', () => {
    it('should find "Inside out" subtitles', async () => {
      const movieHash = '23ef5271db77ed0e'
      const testfile = path.resolve(__dirname, '../resources/Inside Out.srt')

      const expectedSanitizedSrt = await fs.readFile(testfile, 'utf-8')
      const expectedSanitizedSrtLines = expectedSanitizedSrt.split(/\r?\n/)
      const actualSrt = await opensubtitles.getSubtitlesByHash(movieHash)

      // Ignore the last subtitle, because OpenSubtitles
      // adds a final subtitle containing a random ad,
      // e.g. "-= www.OpenSubtitles.org =-".
      const actualSanitizedSrtLines = actualSrt.split(/\r?\n/).slice(0, expectedSanitizedSrtLines.length)

      expect(actualSanitizedSrtLines).toEqual(expectedSanitizedSrtLines)
    }, TIMEOUT_IN_MS)

    it('should fail on a bad hash', async () => {
      const badHash = 'lolz-i-dont-exist'

      await expect(opensubtitles.getSubtitlesByHash(badHash)).rejects.toThrow()
    }, TIMEOUT_IN_MS)
  })
})
