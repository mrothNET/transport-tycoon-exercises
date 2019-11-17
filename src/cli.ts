#! /usr/bin/env node

import { bold, redBright } from "chalk";
import * as program from "commander";
import { writeFileSync } from "fs";
import exercise1 from "./exercise1";
import exercise2 from "./exercise2";

function cmdExercise1(args: string[]) {
  for (const cargoList of args) {
    try {
      const totalDeliveryTime = exercise1(cargoList);
      console.log(`${cargoList}: ${bold(totalDeliveryTime)}`);
    } catch (error) {
      console.error(`${cargoList}: ${redBright(error.message)}`);
    }
  }
}

function cmdExercise2(arg: string, logFile?: string) {
  try {
    const events = exercise2(arg);
    const lines = events.map(event => JSON.stringify(event));

    if (logFile) {
      lines.push("");
      writeFileSync(logFile, lines.join("\n"));
      console.log(`${bold(events.length)} events written to: ${bold(logFile)}`);
    } else {
      lines.forEach(line => console.log(line));
    }
  } catch (error) {
    console.error(`${arg}: ${redBright(error.message)}`);
  }
}

program.name("transport-tycoon");

program
  .command("exercise1 <cargolist...>")
  .description("calculates total delivery time for given cargo list(s)")
  .action(cmdExercise1);

program
  .command("exercise2 <cargolist>")
  .description("print the delivery events for the given cargo list")
  .option("--log <filename>", "writes events to a file")
  .action((arg, cmd) => cmdExercise2(arg, cmd.log));

program.parse(process.argv);
