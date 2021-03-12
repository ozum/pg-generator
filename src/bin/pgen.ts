#!/usr/bin/env node

/* eslint-disable no-console */
import { EOL } from "os";
import { chalk } from "meow-helper";
import getCLI from "./meow-pgen";
import { generate } from "../generate";
import { readGenerators } from "../utils";

function showError(message: string, code = 1): any {
  console.log(chalk.red(`${message}${EOL}`));
  process.exit(code);
}

function getSubGeneratorsMessage(generator: string, subGenerators?: string[]): string {
  const available = subGenerators?.map((name: string) => `${generator}:${name}`).join(`${EOL}  ● `);
  return available ? ` Available sub-generators of "${generator}" are:${EOL}  ● ${available}` : "";
}

async function logHelp(cli: any, generator: string): Promise<void> {
  // const subGenerators = (await readGenerators(generator))?.generators;
  const subGenerators = await readGenerators(generator);
  console.log(cli.help);
  console.log(getSubGeneratorsMessage(generator, subGenerators), EOL);
}

async function executeCommand(): Promise<any> {
  const cli = getCLI();
  if (cli.input[0] === undefined) showError("GENERATOR is required.");
  const [generator, subGenerator] = cli.input[0].split(":");
  if (cli.flags.help) return logHelp(cli, generator);

  try {
    return await generate(generator, subGenerator, cli.flags);
  } catch (error) {
    if (error?.type !== "PgenError") throw error;
    return showError(`${error.message}${getSubGeneratorsMessage(generator, error?.subGenerators)}`);
  }
}

executeCommand().catch(console.log);
