const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const opensubtitles = require('./providers/opensubtitles');
const subdb = require('./providers/subdb');
const subscene = require('./providers/subscene');

const SUBTITLES_PROVIDERS = [
  subdb,
  opensubtitles,
  subscene,
];

/**
 * Get subtitles for the given file.
 *
 * Call each provider one by one until we actually find subtitles.
 *
 * @param {string} file - path to a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function getSubtitles(file) {
  for (const provider of SUBTITLES_PROVIDERS) {
    try {
      return await provider.getSubtitles(file);
    } catch (err) {
      console.error(`Subtitles not found on ${provider}`);
    }
  }
}


/**
 * Download subtitles for the given file and create a '.srt' file next to it,
 * with the same name.
 * 
 * @param {string} file - path to a file
 * @returns {Promise<string>} path to the .srt file
 */
async function downloadSubtitles(file) {
  const subtitles = await getSubtitles(file);

  const { dir, name } = path.parse(file);

  const subtitlesFile = path.format({
    dir,
    name,
    ext: '.srt'
  });

  await fs.writeFileAsync(subtitlesFile, subtitles);

  return subtitlesFile;
}

module.exports = {
  downloadSubtitles,
  getSubtitles
};
