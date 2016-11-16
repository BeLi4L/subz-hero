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
    .then(downloadSubtitlesByHash);
}

/**
 * Create the hash used to identify the file on SubDB.
 * 
 * @param {string} file - path to a file
 * @returns {Promise<string>} a hex string representing the MD5 digest of the
 *                            first 64kB and the last 64kB of the given file
 */
function computeHash(file) {
  return getFileSize(file)
    .then(function(filesize) {
      var chunkSize = 64 * 1024;
      var firstBytesPromise = readBytes({
        file: file,
        start: 0,
        chunkSize: chunkSize
      });
      var lastBytesPromise = readBytes({
        file: file,
        start: filesize - chunkSize,
        chunkSize: chunkSize
      });
      return Promise.all([firstBytesPromise, lastBytesPromise]);
    })
    .then(Buffer.concat)
    .then(md5hex);
}

/**
 * Retrieve the size of a file.
 * 
 * @param {string} file - path to a file
 * @returns {Promise<number>} the size of the given file
 */
function getFileSize(file) {
  return fs
    .statAsync(file)
    .then(stats => stats.size);
} 

/**
 * Read {chunkSize} bytes from the given {file}, starting from byte number {start}.
 * 
 * @param {string} file      - path to a file
 * @param {number} start     - where to start reading from
 * @param {number} chunkSize - number of bytes to read
 * @returns {Promise<Buffer>} a buffer
 */
function readBytes({file, start, chunkSize}) {
  var buffer = new Buffer(chunkSize);
  return fs
    .openAsync(file, 'r')
    .then(function(fileDescriptor) {
      return fs.readAsync(
        fileDescriptor,
        buffer,          // buffer to write to
        0,               // offset in the buffer to start writing at
        chunkSize,       // number of bytes to read
        start            // where to begin reading from in the file
      );
    })
    .then(() => buffer);
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
