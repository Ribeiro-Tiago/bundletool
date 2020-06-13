import { spawnSync } from "child_process";

import { Command } from "./types";
import { BUNDLETOOL_FILE_PATH } from "../bin";

export default async (command: Command, args: string[] = []) => {
  return spawnSync("java", ["-jar", BUNDLETOOL_FILE_PATH, command, ...args]);
};
