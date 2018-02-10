#!/usr/bin/env node

const commander = require('commander')
const subzHero = require('../src/subz-hero')

const args = commander.parse(process.argv).args

args.forEach(subzHero.downloadSubtitles)
