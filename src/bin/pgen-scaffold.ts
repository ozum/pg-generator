#!/usr/bin/env node

/* eslint-disable no-console */
import { EOL } from "os";
import { chalk } from "meow-helper";
import getCLI from "./meow-pgen-scaffold";
import { scaffold, readScaffolds, getScaffoldsMessage } from "../scaffold";

function showError(message: string, code = 1): any {
  console.log(chalk.red(`${message}${EOL}`));
  process.exit(code);
}

async function logHelp(cli: any, scaffolds: string[]): Promise<void> {
  console.log(cli.help);
  console.log(getScaffoldsMessage(scaffolds), EOL);
}

async function executeCommand(): Promise<any> {
  const cli: any = getCLI();
  const scaffolds = await readScaffolds();
  if (cli.flags.help) return logHelp(cli, scaffolds);
  const scaffoldName = cli.input[0];

  try {
    await scaffold(scaffoldName, cli.flags);
    console.log(chalk.green(`"${scaffoldName}" is created in "${cli.flags.outDir}" using "${scaffoldName}" scaffold.`));
  } catch (error) {
    if (error.type !== "PgenError") throw error;
    showError(error.message);
  }
  return undefined;
}

executeCommand().catch(console.log);
