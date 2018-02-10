const OS = require('opensubtitles-api')
const request = require('request-promise')

const OpenSubtitles = new OS({
  useragent: 'OSTestUserAgentTemp',
  ssl: true
})

/**
 * Get subtitles for the given file.
 *
 * @param {string} file - path to a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function getSubtitles (file) {
  const { moviehash } = await OpenSubtitles.hash(file)

  return getSubtitlesByHash(moviehash)
}

/**
 * Get subtitles for the given hash.
 *
 * @param {string} hash - a hex string that identifies a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function getSubtitlesByHash (hash) {
  const result = await OpenSubtitles.search({
    sublanguageid: 'eng',
    hash
  })

  if (!result.en) {
    throw new Error(`No subtitles found for hash ${hash}`)
  }

  return request.get(result.en.url)
}

module.exports = {
  name: 'OpenSubtitles',
  getSubtitles
}
