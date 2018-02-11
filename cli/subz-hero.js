#!/usr/bin/env node

const commander = require('commander')
const fs = require('fs-extra')
const path = require('path')
const fileUtil = require('../src/util/file-util')
const subzHero = require('../src/subz-hero')

console.log('SUBZ-HERO')
console.log('=========')

const args = commander.parse(process.argv).args

args.forEach(downloadSubtitles)

async function downloadSubtitles (file) {
  if (await fileUtil.isDirectory(file)) {
    await downloadSubtitlesInDirectory(file)
  } else {
    await subzHero.downloadSubtitles(file)
  }
}

async function downloadSubtitlesInDirectory (directory) {
  const filenames = await fs.readdir(directory)

  const paths = filenames.map(file => path.resolve(directory, file))

  // TODO: DL by batches, to prevent too many API requests
  paths.forEach(subzHero.downloadSubtitles)
}
