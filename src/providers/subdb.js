const request = require('request-promise');
const hash = require('../utils/hash');

const SUBDB_API_URL = 'http://api.thesubdb.com';

/**
 * Get subtitles for the given file.
 * 
 * @param {string} file - path to a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function getSubtitles(file) {
  const digest = await hash.computeHash(file);

  return getSubtitlesByHash(digest);
}

/**
 * Get subtitles for the given hash.
 * 
 * @param {string} hash - a hex string that identifies a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function getSubtitlesByHash(hash) {
  return request({
    method: 'GET',
    uri: SUBDB_API_URL,
    qs: {
      action: 'download',
      hash: hash,
      language: 'en'
    },
    headers: {
      'User-Agent': 'SubDB/1.0 (subz-hero/0.1; https://github.com/BeLi4L/subz-hero)'
    }
  });
}

module.exports = {
  name: 'SubDB',
  getSubtitles
};
