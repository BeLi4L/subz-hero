var Promise = require('bluebird');
var opensubtitles = require('./providers/opensubtitles');
var subdb = require('./providers/subdb');
var subscene = require('./providers/subscene');

module.exports = {
  downloadSubtitles: downloadSubtitles
};

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
function downloadSubtitles(file) {
  return SUBTITLES_PROVIDERS.reduce(function(sequencePromise, provider) {
    return sequencePromise.catch(function() {
      return provider.downloadSubtitles(file);
    });
  }, Promise.reject());
}
