/* eslint-disable no-console */
import { join } from "path";
import { readFileSync } from "fs";
import meow from "meow";
import getHelp, { commonFlags, ExtendedAnyFlags } from "meow-helper";

const command = "pgen";
const pkg = JSON.parse(readFileSync(join(__dirname, "../../package.json"), { encoding: "utf8" }));

const args = { "SCAFFOLD*": "The scaffold project to copy." };

const flags: ExtendedAnyFlags = {
  outDir: { type: "string", isRequired: true, desc: "Path of the output directory." },
  ...commonFlags,
};

const examples = ["pgen-scaffold nunjucks --outDir pg-generator-my-generator"];

export default function getCLI(): meow.Result<typeof flags> {
  const help = getHelp({ lineLength: 140, flags, args, pkg, examples, command });
  return meow(help, { flags, pkg, allowUnknownFlags: false });
}
