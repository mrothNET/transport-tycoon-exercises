#! /usr/bin/env node

import { bold, redBright } from "chalk";
import * as program from "commander";
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

function cmdExercise2(arg: string) {
  try {
    const events = exercise2(arg);

    for (const event of events) {
      console.log(JSON.stringify(event));
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
  .description("print the delivery events for the gove cargo list")
  .action(cmdExercise2);

program.parse(process.argv);
