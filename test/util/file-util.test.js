const path = require('path')
const fileUtil = require('../../src/util/file-util')

const testfile = path.resolve(__dirname, 'test-file.txt')
const testfileSize = 119

describe('file-util', () => {
  describe('#getFileSize', () => {
    it('should return the size of the given file', async () => {
      const size = await fileUtil.getFileSize(testfile)
      expect(size).toBe(testfileSize)
    })

    it('should throw an error if the file does not exist', async() => {
      await expect(fileUtil.getFileSize('missing_file')).rejects.toThrow()
    })
  })

  describe('#readBytes', () => {
    it('should return a full chunk when (start + chunkSize < filesize)', async () => {
      const buffer = await fileUtil.readBytes({
        file: testfile,
        start: 0,
        chunkSize: 38
      })
      const expectedBuffer = Buffer.from('This file is used by file-util.spec.js')
      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer).toHaveLength(38)
      expect(buffer).toEqual(expectedBuffer)
    })

    it('should return a short chunk when (start < filesize <= start + chunkSize)', async () => {
      const buffer = await fileUtil.readBytes({
        file: testfile,
        start: testfileSize - 23,
        chunkSize: 10000
      })
      const expectedBuffer = Buffer.from('impact file-util tests.')
      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer).toHaveLength(23)
      expect(buffer).toEqual(expectedBuffer)
    })

    it('should return an empty chunk when (filesize <= start)', async () => {
      const buffer = await fileUtil.readBytes({
        file: testfile,
        start: testfileSize,
        chunkSize: 10000
      })
      const expectedBuffer = Buffer.alloc(0)
      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer).toHaveLength(0)
      expect(buffer).toEqual(expectedBuffer)
    })

    it('should throw an error if the file does not exist', async () => {
      const promise = fileUtil.readBytes({
        file: 'missing_file',
        start: 0,
        chunkSize: 10
      })
      await expect(promise).rejects.toThrow()
    })
  })
})
