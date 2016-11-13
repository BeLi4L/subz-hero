var crypto = require('crypto');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var request = require('request-promise');

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
  return computeHash(file)
    .then(function(hash) {
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
    });
}

/**
 * Create the hash used to identify the file on SubDB.
 * 
 * @param {string} file - path to a file
 * @returns {Promise<string>} a hex string representing the MD5 digest of the
 *                            first 64kB and the last 64kB of the given file
 */
function computeHash(file) {
  return fs
    .openAsync(file, 'r')
    .then(function(fileDescriptor) {
      return fs
        .fstatAsync(fileDescriptor)
        .then(function(stats) {
          var fileSize = stats.size;
          var chunkSize = 64 * 1024;
          var buffer = new Buffer(2 * chunkSize);

          var first64kBPromise = fs.readAsync(
            fileDescriptor,
            buffer,              // buffer to write to
            0,                   // offset in the buffer to start writing at
            chunkSize,           // number of bytes to read
            0                    // where to begin reading from in the file
          );
          var last64kBPromise = fs.readAsync(
            fileDescriptor,
            buffer,              // buffer to write to
            chunkSize,           // offset in the buffer to start writing at
            chunkSize,           // number of bytes to read
            fileSize - chunkSize // where to begin reading from in the file
          );

          return Promise
            .all([first64kBPromise, last64kBPromise])
            .then(() => buffer);
        });
    })
    .then(md5hex);
}

/**
 * Compute the MD5 digest of the given Buffer.
 * 
 * @param {Buffer} buffer
 * @returns {string} the hexadecimal MD5 hash of the given buffer
 */
function md5hex(buffer) {
  return crypto
    .createHash('md5')
    .update(buffer)
    .digest('hex');
}
