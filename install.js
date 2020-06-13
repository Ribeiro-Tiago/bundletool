const { existsSync, mkdirSync, createWriteStream } = require("fs");
const axios = require("axios");

const {
  BUNDLETOOL_VERSION,
  DEFAULT_BASE_DIRECTORY,
  BUNDLETOOL_FILE_PATH,
} = require("./constants");
const BUNDLETOOL_URL = `https://github.com/google/bundletool/releases/download/${BUNDLETOOL_VERSION}/bundletool-all-${BUNDLETOOL_VERSION}.jar`;

const log = (message) => {
  const logLevel = process.env.npm_config_loglevel;
  const logLevelDisplay = ["silent", "error", "warn"].indexOf(logLevel) > -1;

  if (!logLevelDisplay) {
    console.log(message);
  }
};

const getFileStream = () => {
  if (!existsSync(DEFAULT_BASE_DIRECTORY)) {
    mkdirSync(DEFAULT_BASE_DIRECTORY);
  }

  return createWriteStream(BUNDLETOOL_FILE_PATH);
};

const downloadBinary = () => {
  return new Promise(async (resolve, reject) => {
    log(
      `Downloading bundletool ${BUNDLETOOL_VERSION} to ${BUNDLETOOL_FILE_PATH}`,
    );

    const { data } = await axios.get(BUNDLETOOL_URL, {
      responseType: "stream",
      headers: {
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
      },
    });

    data.pipe(getFileStream());

    data.on("end", () => {
      resolve(BUNDLETOOL_FILE_PATH);
    });
    data.on("error", (error) => {
      reject(error);
    });

    return BUNDLETOOL_FILE_PATH;
  });
};

const setupBundletool = async () => {
  if (!existsSync(BUNDLETOOL_FILE_PATH)) {
    await downloadBinary();
  }
};

setupBundletool();
