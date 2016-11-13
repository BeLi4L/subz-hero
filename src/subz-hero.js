var subdb = require('./providers/subdb');
var subscene = require('./providers/subscene');

subscene
  .downloadSubtitles('D:/Films/Old Boy/Old Boy.mkv')
  .then(function(subtitles) {
    console.log(subtitles);
  })
  .catch(function(error) {
    console.error(error.message);
  });
