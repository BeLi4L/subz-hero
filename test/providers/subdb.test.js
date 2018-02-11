const fs = require('fs-extra')
const path = require('path')
const subdb = require('../../src/providers/subdb')

describe('subdb', () => {
  describe('#getSubtitlesByHash', () => {
    it('should find "I Origins" subtitles', async () => {
      const movieHash = 'df2273eb4d8adad44d870f553d3b8788'
      const testfile = path.resolve(__dirname, '../resources/I Origins.srt')

      const expectedSrt = await fs.readFile(testfile, 'utf-8')
      const actualSrt = await subdb.getSubtitlesByHash(movieHash)

      expect(actualSrt).toBe(expectedSrt)
    })

    it('should fail on a bad hash', async () => {
      const badHash = 'lolz-i-dont-exist'

      await expect(subdb.getSubtitlesByHash(badHash)).rejects.toThrow()
    })
  })
})
