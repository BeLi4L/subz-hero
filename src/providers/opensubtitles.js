const OS = require('opensubtitles-api');
const request = require('request-promise');

const OpenSubtitles = new OS({
  useragent: 'OSTestUserAgentTemp',
  ssl: true
});

/**
 * Download subtitles for the given file.
 * 
 * @param {string} file - path to a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
function downloadSubtitles(file) {
  return OpenSubtitles
    .extractInfo(file)
    .then(infos => infos.moviehash)
    .then(downloadSubtitlesByHash);
}

/**
 * Download subtitles for the given hash.
 * 
 * @param {string} hash - a hex string that identifies a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
function downloadSubtitlesByHash(hash) {
  return OpenSubtitles
    .search({
      sublanguageid: 'eng',
      hash: hash
    })
    .then(function(result) {
      if (result.en) {
        return request({
          method: 'GET',
          url: result.en.url
        });
      } else {
        throw new Error(`No subtitles found for hash ${hash}`);
      }
    });
}

module.exports = {
  downloadSubtitles: downloadSubtitles
};