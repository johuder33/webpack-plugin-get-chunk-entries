const { basename, extname } = require("path");
const fs = require("fs");
const { isRegExp, isString } = require("./utils");

class GetChunkEntriesPlugin {
  constructor(options) {
    this.options = options;
    this.entry = {};
  }

  getAllEntries() {
    const { source } = this.options;
    return this.inspectPath(source);
  }

  isFileMatched(filename) {
    const { filename: targetFilename } = this.options;
    if (isRegExp(targetFilename)) {
      return targetFilename.test(filename);
    }

    return basename(filename) === targetFilename;
  }

  isExcluded(path) {
    const { exclude } = this.options;
    return exclude.some(condition => {
      if (isRegExp(condition)) {
        return condition.test(path);
      }
      if (isString(condition)) {
        return basename(path) === condition;
      }
      return false;
    });
  }

  getPathWithoutExtname(path) {
    const extension = extname(path);
    const pathWithoutExt = path.replace(extension, "");
    return pathWithoutExt;
  }

  getRelativeSourcePath(path) {
    const { source } = this.options;
    const relativePath = path.split(source);
    return relativePath && relativePath.length > 0 ? relativePath.pop() : path;
  }

  inspectPath(path, entries = {}) {
    const stats = fs.lstatSync(path);

    if (stats && stats.isDirectory()) {
      const files = fs.readdirSync(path);
      files.forEach(filename =>
        this.inspectPath(`${path}/${filename}`, entries)
      );
    }

    if (stats.isFile() && this.isFileMatched(path) && !this.isExcluded(path)) {
      let key = this.getPathWithoutExtname(path);
      key = this.getRelativeSourcePath(key);
      entries[key] = path;
    }

    return entries;
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap(this.constructor.name, () => {
      const entries = this.getAllEntries();
      Object.keys(entries).forEach(key => {
        compiler.options.entry[key] = entries[key];
      });
    });
  }
}

module.exports = GetChunkEntriesPlugin;
