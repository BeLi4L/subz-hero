const AdmZip = require('adm-zip');
const cheerio = require('cheerio');
const natural = require('natural');
const path = require('path');
const request = require('request-promise');

const SUBSCENE_URL = process.env.SUBSCENE_URL || 'https://subscene.com';

class SearchResult {
  constructor({title, url, coefficient}) {
    this.title = title;
    this.url = url;
    this.coefficient = coefficient;
  }
}

/**
 * Get subtitles for the given file.
 *
 * @param {string} file - path to a file
 * @returns {Promise<string>} the subtitles, formatted as .srt
 */
async function getSubtitles(file) {
  const filename = path.parse(file).name;

  return getSubtitlesList(filename)
    .then(parseSearchResults)
    .then(getBestSearchResult(filename))
    .then(getSubtitlesPage)
    .then(parseDownloadLink)
    .then(downloadZip)
    .then(extractSrt);
}



/**
 * Search for the given file on SubScene.
 *
 * @param {string} filename
 * @returns {Promise<string>} the HTML string, containing the search results
 */
async function getSubtitlesList(filename) {
  return request({
    method: 'GET',
    uri: SUBSCENE_URL + '/subtitles/release',
    qs: {
      q: filename, // search query
      l: '',       // language (english)
      r: true      // released or whatever
    }
  });
}

/**
 * Parse an HTML document that contains a list of SubScene search results.
 *
 * @param {string} html
 * @returns {Array<SearchResult>} the list of search results
 */
function parseSearchResults(html) {
  const $ = cheerio.load(html);
  return $('a')
    .filter(function(index, element) {
      const spans = $(element).find('span');
      return spans.length === 2 && spans.eq(0).text().trim() === 'English';
    })
    .map(function(index, element) {
      const title = $(element).find('span').eq(1).text().trim();
      const url = $(element).attr('href');
      return new SearchResult({
        title: title,
        url: url
      });
    })
    .get();
}

function getBestSearchResult(filename) {
  /**
   * Get the search result whose title is as close to filename as possible.
   *
   * @param {Array<SearchResult>} searchResults
   * @returns {SearchResult} the "best" search result
   */
  return function(searchResults) {
    const weightedSearchResults = searchResults
      .map(function(searchResult) {
        return new SearchResult({
          title: searchResult.title,
          url: searchResult.url,
          coefficient: natural.DiceCoefficient(filename, searchResult.title)
        });
      })
      .sort((a,b) => b.coefficient - a.coefficient);
    return weightedSearchResults[0];
  };
}

/**
 * Get the details page of the given SearchResult.
 *
 * @param {SearchResult} searchResult
 * @returns {Promise<string>} the HTML page for the given SearchResult
 */
async function getSubtitlesPage(searchResult) {
  return request({
    method: 'GET',
    uri: SUBSCENE_URL + searchResult.url
  });
}

/**
 * Extract the download link from the HTML page.
 *
 * @param {string} html
 * @returns {string} the path to download the subtitles
 */
function parseDownloadLink(html) {
  const $ = cheerio.load(html);
  return $('#downloadButton').eq(0).attr('href');
}

/**
 * Download the subtitles based on the given link.
 *
 * @param {string} href
 * @returns {Promise<Buffer>} the ZIP content
 */
async function downloadZip(href) {
  return request({
    method: 'GET',
    uri: SUBSCENE_URL + href,
    encoding: null
  });
}

/**
 * Extract the first .srt file found in the given ZIP buffer.
 *
 * @param {Buffer} buffer
 * @returns {string} the content of the first .srt file found in the given ZIP
 */
function extractSrt(buffer) {
  const zip = new AdmZip(buffer);
  const srtZipEntry = zip
    .getEntries()
    .find(zipEntry =>
      zipEntry.entryName.endsWith('.srt')
    );
  return zip.readAsText(srtZipEntry);
}

module.exports = {
  name: 'Subscene',
  getSubtitles
};
