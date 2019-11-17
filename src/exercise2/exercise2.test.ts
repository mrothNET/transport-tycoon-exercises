import { exercise2 } from "./exercise2";
import { Time } from "./Time";

const testVectors: Array<[string, Time]> = [
  ["A", 5],
  ["B", 5],
  ["AA", 13],
  ["BB", 5],
  ["AB", 5],
  ["BA", 5],
  ["ABB", 7],
  ["BAA", 13],
];

test.each(testVectors)("exercise2(%p)", (cargoList, totalDeliveryTime) => {
  expect(exercise2(cargoList)).toBe(totalDeliveryTime);
});
