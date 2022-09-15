import { spawnSync } from "child_process";
import commandExists from 'command-exists';

import { Command } from "./types";
import { BUNDLETOOL_FILE_PATH } from "../constants";

if (!commandExists.sync('java')) {
  throw new Error("Java is required for bundletool");
}

export default async (command: Command, args: string[] = []) => {
  return spawnSync("java", ["-jar", BUNDLETOOL_FILE_PATH, command, ...args]);
};
