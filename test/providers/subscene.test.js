const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const subscene = require('../../src/providers/subscene')

describe('subscene', () => {
  describe('#getSubtitlesByFilename', () => {
    it('should find "Castle in the sky" subtitles', async () => {
      const testfile = path.resolve(__dirname, 'resources/Castle in the sky.srt')

      const expectedSrt = await fs.readFileAsync(testfile, 'utf-8')
      const actualSrt = await subscene.getSubtitlesByFilename('Castle in the sky.mkv')

      expect(actualSrt).toBe(expectedSrt)
    })
  })
})
