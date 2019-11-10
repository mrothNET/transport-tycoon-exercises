#! /usr/bin/env node

import { bold, redBright } from "chalk";
import * as program from "commander";
import exercise1 from "./exercise1";

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

program.name("transport-tycoon");

program
  .command("exercise1 <cargolist...>")
  .description("calculates total delivery time for given cargo list(s)")
  .action(cmdExercise1);

program.parse(process.argv);
