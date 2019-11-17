import { Cargo } from "./Cargo";

test("Cargo IDs", () => {
  const a = new Cargo("FACTORY", "A");
  const b = new Cargo("FACTORY", "B");

  expect(Number.isInteger(a.cargo_id)).toBe(true);
  expect(a.cargo_id).toBeGreaterThan(0);
  expect(a.cargo_id).not.toBe(b.cargo_id);
});
