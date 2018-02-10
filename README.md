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

If you want to be able to download subtitles with a simple right click on a file:

- open regedit.exe
- expand HKEY_CLASSES_ROOT/SystemFileAssociations
- for each video file extension (mkv, avi, mp4, etc.), you need to add a key, as follows: for instance for mkv files, go to .mkv, create the Shell sub-folder if it is not present, right-click on Shell > New > Key, call it 'Download subtitles'. Then, similarly create a new key under the 'Download subtitles' folder called 'command', double click on default value and in its data, write: subz-hero "%L"

<!-- TODO: create a .reg script to do this automatically for all video types -->
