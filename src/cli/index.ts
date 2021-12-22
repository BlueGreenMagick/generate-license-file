import arg, { Result } from "arg";
import { generateLicenseFile } from "../generateLicenseFile";
import { Eol } from "./args/eol";
import { Input } from "./args/input";
import { NoSpinner } from "./args/no-spinner";
import { Output } from "./args/output";
import { ArgumentsWithAliases, argumentsWithAliases, CliOptions } from "./cli-arguments";
import { spinner } from "./spinner";

export async function cli(args: string[]): Promise<void> {
  try {
    await runCli(args);
  } catch (e) {
    spinner.fail(e?.message ?? e ?? "Unknown error");
  }
}

async function runCli(args: string[]) {
  const givenUserInputs = parseUserInputs(args);
  const { input, output, eol, noSpinner } = await promptForMissingOptions(givenUserInputs);

  if (!noSpinner) {
    spinner.start();
  }

  await generateLicenseFile(input, output, eol);
  spinner.stop();
}

function parseUserInputs(rawArgs: string[]): Result<ArgumentsWithAliases> {
  return arg(argumentsWithAliases, {
    argv: rawArgs.slice(2)
  });
}

async function promptForMissingOptions(options: Result<ArgumentsWithAliases>): Promise<CliOptions> {
  const input = await new Input().resolve(options);
  const output = await new Output().resolve(options);
  const eol = await new Eol().resolve(options);
  const noSpinner = await new NoSpinner().resolve(options);

  return { input, output, eol, noSpinner };
}
