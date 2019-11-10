import { exercise1 } from "./exercise1";
import { Time } from "./Time";

const testVectors: Array<[string, Time]> = [
  ["A", 5],
  ["B", 5],
  ["AA", 13],
  ["BB", 5],
  ["AB", 5],
  ["BA", 5],
  ["ABB", 7],
  ["BAA", 13]
];

test.each(testVectors)("exercise1(%p)", (cargoList, totalDeliveryTime) => {
  expect(exercise1(cargoList)).toBe(totalDeliveryTime);
});
