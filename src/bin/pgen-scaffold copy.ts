#!/usr/bin/env node

/* eslint-disable no-console */
import { join, basename, extname } from "path";
import { EOL } from "os";
import { chalk } from "meow-helper";
import { promises as fs } from "fs";
import { ignoreCode } from "ignor";
import getCLI from "./meow-pgen-scaffold";
import { copyDir } from "../utils";

const SCAFFOLD_DIR = join(__dirname, "../../module-files/scaffolds");

function showError(message: string, code = 1): any {
  console.log(chalk.red(`${message}${EOL}`));
  process.exit(code);
}

function getScaffoldsMessage(scaffolds: string[]): string {
  const available = scaffolds.join(`${EOL}  ● `);
  return available ? `Available scaffolds are:${EOL}  ● ${available}` : "";
}

async function logHelp(cli: any, scaffolds: string[]): Promise<void> {
  console.log(cli.help);
  console.log(getScaffoldsMessage(scaffolds), EOL);
}

async function renameProject(path: string, name: string): Promise<void> {
  const pkgPath = join(path, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgPath, { encoding: "utf-8" }));
  pkg.name = name;
  await fs.writeFile(pkgPath, JSON.stringify(pkg, undefined, 2));
}

async function executeCommand(): Promise<any> {
  const cli: any = getCLI();
  const scaffolds = (await fs.readdir(SCAFFOLD_DIR, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name);
  const scaffold = cli.input[0];
  const outDir = cli.flags.outDir as string;
  const name = cli.flags.name ?? `pg-generator-${basename(outDir, extname(outDir)).replace("pg-generator-", "")}`;

  if (cli.flags.help) return logHelp(cli, scaffolds);
  if (scaffold === undefined) showError("SCAFFOLD is required.");
  if (!scaffolds.includes(scaffold)) showError(`Unknown scaffold "${scaffold}". ${getScaffoldsMessage(scaffolds)}`);

  try {
    const destinationEntries = await fs.readdir(outDir).catch(ignoreCode("ENOENT"));
    if (destinationEntries && destinationEntries.length > 0) showError(`Output directory "${outDir}" is not empty.`);
  } catch (error) {
    if (error.code === "ENOTDIR") showError(`"${outDir}" is not a directory.`);
  }

  try {
    await copyDir(join(SCAFFOLD_DIR, scaffold), outDir);
    await renameProject(outDir, name);
    console.log(chalk.green(`"${name}" is created in "${outDir}" using "${scaffold}" scaffold.`));
  } catch (error) {
    if (error?.type !== "PgenError") throw error;
  }
  return undefined;
}

executeCommand().catch(console.log);
