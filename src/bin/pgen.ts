import { EOL } from "os";
import { chalk } from "meow-helper";
import getCLI from "./meow";
import { generate } from "../generate";

function logError(message: string, code = 1): void {
  console.log(chalk.red(`${message}${EOL}`)); // eslint-disable-line no-console
  process.exit(code);
}

async function executeCommand(): Promise<any> {
  const cli = getCLI();
  if (cli.input[0] === undefined) logError("GENERATOR is required.");
  const [generator, subGenerator] = cli.input[0].split(":");
  try {
    return await generate(generator, subGenerator, cli.flags);
  } catch (error) {
    const available = error?.subGenerators?.map((name: string) => `${generator}:${name}`).join(`${EOL}  ● `);
    const availableLog = available ? ` Available sub-generators are:${EOL}  ● ${available}` : "";

    return logError(`${error.message}${availableLog}`);
  }
}

executeCommand();
