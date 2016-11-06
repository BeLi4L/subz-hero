var subdb = require('./providers/subdb');

subdb
  .downloadSubtitles('D:/Films/Enron, the Smartest Guys in the Room.avi')
  .then(function(subtitles) {
    console.log(subtitles);
  })
  .catch(function(error) {
    console.error(error.message);
  });
