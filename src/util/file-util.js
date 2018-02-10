const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

/**
 * Retrieve the size of a file.
 *
 * @param {string} file - path to a file
 * @returns {Promise<number>} the size of the given file
 */
async function getFileSize (file) {
  const { size } = await fs.statAsync(file)
  return size
}

/**
 * Read `chunkSize` bytes from the given `file`, starting from byte number `start`.
 *
 * @param {string} file      - path to a file
 * @param {number} start     - byte to start reading from
 * @param {number} chunkSize - number of bytes to read
 * @returns {Promise<Buffer>}
 */
async function readBytes ({ file, start, chunkSize }) {
  const buffer = Buffer.alloc(chunkSize)

  const fileDescriptor = await fs.openAsync(file, 'r')

  const bytesRead = await fs.readAsync(
    fileDescriptor,
    buffer,          // buffer to write to
    0,               // offset in the buffer to start writing at
    chunkSize,       // number of bytes to read
    start            // where to begin reading from in the file
  )

  // Slice the buffer in case chunkSize > fileSize - start
  return buffer.slice(0, bytesRead)
}

module.exports = {
  getFileSize,
  readBytes
}
