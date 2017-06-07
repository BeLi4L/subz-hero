const opensubtitles = require('./providers/opensubtitles');
const subdb = require('./providers/subdb');
const subscene = require('./providers/subscene');

const SUBTITLES_PROVIDERS = [
  subdb,
  opensubtitles,
  subscene
];

/**
 * Download subtitles for the given file.
 * <p>
 * Call each provider one by one until we actually find subtitles.
 *
 * @param {string} file - path to a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function downloadSubtitles(file) {
  for (const provider of SUBTITLES_PROVIDERS) {
    try {
      return await provider.downloadSubtitles(file);
    } catch (err) {
      console.error(`Subtitles not found on ${provider}`);
    }
  }
}

module.exports = {
  downloadSubtitles
};
