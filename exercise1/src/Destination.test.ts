import { destinations, isDestination } from "./Destination";

test.each(destinations)("isDestination(%p)", (destination) => {
  expect(isDestination(destination)).toBe(true);
});

test.each(["", "unknown", 123, {}, [], null])("isDestination(%p)", (destination) => {
  expect(isDestination(destination as string)).toBe(false);
});
