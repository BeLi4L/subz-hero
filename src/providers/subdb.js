const crypto = require('crypto')
const request = require('request-promise')
const fileUtil = require('../util/file-util')

const SUBDB_API_URL = 'http://api.thesubdb.com'

/**
 * Get subtitles for the given file.
 *
 * @param {string} file - path to a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function getSubtitles (file) {
  const digest = await hash(file)

  return getSubtitlesByHash(digest)
}

/**
 * Get subtitles for the given hash.
 *
 * @param {string} hash - a hex string that identifies a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function getSubtitlesByHash (hash) {
  return request({
    method: 'GET',
    uri: SUBDB_API_URL,
    qs: {
      hash,
      action: 'download',
      language: 'en'
    },
    headers: {
      'User-Agent': 'SubDB/1.0 (subz-hero/0.1; https://github.com/BeLi4L/subz-hero)'
    }
  })
}

/**
 * Create the hash used to identify a file.
 *
 * @param {string} file - path to a file
 * @returns {Promise<string>} a hex string representing the MD5 digest of the
 *                            first 64kB and the last 64kB of the given file
 */
async function hash (file) {
  const filesize = await fileUtil.getFileSize(file)

  const chunkSize = 64 * 1024

  const firstBytesPromise = fileUtil.readBytes({
    file,
    chunkSize,
    start: 0
  })

  const lastBytesPromise = fileUtil.readBytes({
    file,
    chunkSize,
    start: filesize - chunkSize
  })

  const [ firstBytes, lastBytes ] = await Promise.all([firstBytesPromise, lastBytesPromise])

  return crypto
    .createHash('md5')
    .update(firstBytes)
    .update(lastBytes)
    .digest('hex')
}

module.exports = {
  name: 'SubDB',
  getSubtitles,
  getSubtitlesByHash
}
