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
async function downloadSubtitles(file) {
  const infos = await OpenSubtitles.extractInfo(file);

  return downloadSubtitlesByHash(infos.moviehash);
}

/**
 * Download subtitles for the given hash.
 * 
 * @param {string} hash - a hex string that identifies a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function downloadSubtitlesByHash(hash) {
  const result = await OpenSubtitles.search({
    sublanguageid: 'eng',
    hash
  });

  if (!result.en) {
    throw new Error(`No subtitles found for hash ${hash}`);
  }

  return request({
    method: 'GET',
    url: result.en.url
  });
}

module.exports = {
  downloadSubtitles: downloadSubtitles
};