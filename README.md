# JS13K 2018

This repository allow you to quick start your JS13K project to develop, compile, minify and zip you JS13K project.

Uses adfab-gulp-boilerplate to compile sass or less, concat you JS, minify your assets...with additional tasks to zip and improve minification

[You can play the game here thanks to the GitHub Pages](https://jonathan-vallet.github.io/js13k-2018/index.html).

## Installing

Run `npm install` in the project directory to install all needed packages.

## Compile game

`gulp` to compile your files

Project will be generated in `/www` folder.

## Generate final game

run `gulp --production && gulp zip`

Your game.zip file will be generated in `/dist` folder.

## Credits

Many code parts are inspired/adaptated from the work of other devs to save time.
- Raytracing system is inpired: from https://ncase.me/sight-and-light/
- Compass is inspired from: http://cssdeck.com/labs/building-a-css3-compass
- Mobile phone design is inspired from: https://marvelapp.github.io/devices.css/