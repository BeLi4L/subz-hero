const request = require('request-promise');
const hash = require('../utils/hash');

const SUBDB_API_URL = 'http://api.thesubdb.com';

module.exports = {
  downloadSubtitles: downloadSubtitles
};

/**
 * Download subtitles for the given file.
 * 
 * @param {string} file - path to a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
function downloadSubtitles(file) {
  return hash
    .computeHash(file)
    .then(downloadSubtitlesByHash);
}

/**
 * Download subtitles for the given hash.
 * 
 * @param {string} hash - a hex string that identifies a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
function downloadSubtitlesByHash(hash) {
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
