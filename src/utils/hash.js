const crypto = require('crypto');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = {
  computeHash: computeHash
};

/**
 * Create the hash used to identify a file (e.g. on SubDB).
 * 
 * @param {string} file - path to a file
 * @returns {Promise<string>} a hex string representing the MD5 digest of the
 *                            first 64kB and the last 64kB of the given file
 */
async function computeHash(file) {
  const filesize = await getFileSize(file);

  const chunkSize = 64 * 1024;

  const firstBytesPromise = readBytes({
    file,
    chunkSize,
    start: 0,
  });

  const lastBytesPromise = readBytes({
    file,
    chunkSize,
    start: filesize - chunkSize,
  });

  const [ firstBytes, lastBytes ] = await Promise.all([firstBytesPromise, lastBytesPromise]);

  return md5hex(Buffer.concat(firstBytes, lastBytes));
}

/**
 * Retrieve the size of a file.
 * 
 * @param {string} file - path to a file
 * @returns {Promise<number>} the size of the given file
 */
async function getFileSize(file) {
  const stats = await fs.statAsync(file);
  return stats.size;
} 

/**
 * Read {chunkSize} bytes from the given {file}, starting from byte number {start}.
 * 
 * @param {string} file      - path to a file
 * @param {number} start     - where to start reading from
 * @param {number} chunkSize - number of bytes to read
 * @returns {Promise<Buffer>} a buffer
 */
async function readBytes({file, start, chunkSize}) {
  const buffer = new Buffer(chunkSize);

  const fileDescriptor = await fs.openAsync(file, 'r');

  await fs.readAsync(
    fileDescriptor,
    buffer,          // buffer to write to
    0,               // offset in the buffer to start writing at
    chunkSize,       // number of bytes to read
    start            // where to begin reading from in the file
  );

  return buffer;
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
