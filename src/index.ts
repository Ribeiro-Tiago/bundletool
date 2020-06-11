import { existsSync, mkdirSync, createWriteStream } from "fs";
import { resolve, join } from "path";
import request from "request-promise";
import requestSync from "request";
import { spawnSync } from "child_process";
import { config as dotenv } from "dotenv";

import { RequestResponse, Command } from "./types";

dotenv();

const DEFAULT_BASE_DIRECTORY = resolve(__dirname, process.env.BIN as string);
const BUNDLETOOL_URL =
  "https://api.github.com/repos/google/bundletool/releases/latest";
const BUNDLETOOL_FILE_NAME = "bundletool.jar";
const BUNDLETOOL_FILE_PATH = join(DEFAULT_BASE_DIRECTORY, BUNDLETOOL_FILE_NAME);

const getFileStream = () => {
  if (!existsSync(DEFAULT_BASE_DIRECTORY)) {
    mkdirSync(DEFAULT_BASE_DIRECTORY);
  }

  return createWriteStream(BUNDLETOOL_FILE_PATH);
};

const downloadBinary = async () => {
  let response: RequestResponse;
  try {
    response = JSON.parse(
      await request(BUNDLETOOL_URL, {
        headers: { "User-Agent": "node-aab-parser" },
      }),
    );
  } catch (err) {
    throw new Error("Unable to download the binary at " + BUNDLETOOL_URL);
  }

  const binaryLink = response.assets[0]?.browser_download_url;

  if (!binaryLink) {
    throw new Error("No binary link found");
  }

  return new Promise((resolve, reject) => {
    requestSync(binaryLink, {
      headers: {
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
      },
      gzip: true,
    })
      .pipe(getFileStream())
      .on("error", reject)
      .on("close", () => resolve(BUNDLETOOL_FILE_PATH));
  });
};

const setupBundletool = async () => {
  if (!existsSync(BUNDLETOOL_FILE_PATH)) {
    await downloadBinary();
  }
};

export default async (command: Command, args: string[] = []) => {
  await setupBundletool();

  return spawnSync("java", ["-jar", BUNDLETOOL_FILE_PATH, command, ...args]);
};
