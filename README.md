# webpack-plugin-get-chunk-entries

A Webpack plugin to automatically get all the entries as chunks

> This plugin was inspired by the folder structure of `@material-ui/code` package, to get a specific component by its folder.

## Install

> `$ npm install webpack-plugin-get-chunk-entries --save-dev`

or

> `yarn add webpack-plugin-get-chunk-entries`

## Usage

Suppose you have a folder structure like this

```
.
+-- src
|   +-- index.ts
|   +-- components
|       +-- Button
|           +-- index.ts
|           +-- noSelected.ts
|   +-- privateComponent
|       +-- FancyInput
|           +-- index.ts
+-- webpack.config.js
```

```javascript
const WebpackGetEntriesPlugin = require("webpack-plugin-get-chunk-entries");
const path = require("path");

// webpack config
module.exports = {
  // ...
  plugins: [
    new WebpackGetEntriesPlugin({
      source: path.resolve("src"),
      filename: /(index|specialFile)\.(tsx?|jsx?)$/,
      exclude: [/\/privateComponent/, /\/src\/index\.(tsx?|jsx?)/]
    })
  ]
};
```

after using the plugin. you will bundling the `output` all the files that matches with your `filename` regexp.

As you can see you provide a `exclude` option, that will skip all files / folders that matches with the exclude regexp array, so you can skip multiple folder by adding into the `exclude` array.

## API

webpack-plugin-get-chunk-entries(options)

`options.source`

Type: `RegExp | String`
default: `undefined`

This is the entry point folder to start searching the entries that you desire to bundle by individual chunks

`options.filename`

Type: `RegExp | String`
default: `undefined`

This is the filename that you want to pick to bundle as a chunk, so you can use and string `index.js` putting a literal string or a regexp for more flexible scenarios `/index\.(tsx?|jsx?)$/`.

`options.exclude`

Type: `Array[RegExp | String]`
default: `undefined`

This option will be used to skip some folders or files that you won't bundle, so just pass an array of string for a very specific file, or a RegExp for more complex pattern.
