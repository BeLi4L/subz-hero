# Subz-hero · [![Build Status](https://travis-ci.org/BeLi4L/subz-hero.svg?branch=master)](https://travis-ci.org/BeLi4L/subz-hero)

A library / CLI to download subtitles for movies and series.


## How to install

- Install [Node.js](https://nodejs.org)
- Run `npm install -g subz-hero`


## How to run

```
subz-hero FILE [FILE]...
```

For example:

```
subz-hero Interstellar.mkv
```

will download subtitles and create a `Interstellar.srt` file.


## How to add a 'Download subtitles' entry in Windows context menu

Clone this repo, open the `scripts` directory, and run the script called `Add to context menu.reg`.

Or if you want to do this manually:

- open regedit.exe
- expand HKEY_CLASSES_ROOT/SystemFileAssociations
- for each video file extension (mkv, avi, mp4, etc.), you need to add a key, as follows: 
  * go to .mkv
  * right click > New > Key, call it `shell`
  * right-click on `shell` > New > Key, call it `Download subtitles` (that's the label in the context menu)
  * right-click on `Download subtitles` > New > Key, call it `command`
  * double click on default value and in its data, write: `cmd.exe /c subz-hero "%L"`
