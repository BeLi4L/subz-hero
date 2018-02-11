#!/usr/bin/env node

const commander = require('commander')
const fs = require('fs-extra')
const fileUtil = require('../src/util/file-util')
const subzHero = require('../src/subz-hero')

console.log('SUBZ-HERO')
console.log('=========')

const args = commander.parse(process.argv).args

args.forEach(downloadSubtitles)

async function downloadSubtitles (path) {
  if (await fileUtil.isDirectory(path)) {
    const files = await fs.readdir(path)

    // TODO: DL by batches, to prevent too many API requests
    files.forEach(subzHero.downloadSubtitles)
  } else {
    await subzHero.downloadSubtitles(path)
  }
}
