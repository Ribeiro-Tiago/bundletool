const { resolve, join } = require("path");

const BIN_PATH = ".bundletool";
const DEFAULT_BASE_DIRECTORY = resolve(__dirname, BIN_PATH);
const BUNDLETOOL_FILE_PATH = join(DEFAULT_BASE_DIRECTORY, "bundletool.jar");

module.exports = {
  BIN_PATH,
  DEFAULT_BASE_DIRECTORY,
  BUNDLETOOL_FILE_PATH,
};
