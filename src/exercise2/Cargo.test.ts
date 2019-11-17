import { Cargo } from "./Cargo";

test("Cargo IDs", () => {
  const a = new Cargo("FACTORY", "A");
  const b = new Cargo("FACTORY", "B");

  expect(Number.isInteger(a.cargo_id)).toBe(true);
  expect(Number.isInteger(b.cargo_id)).toBe(true);

  expect(a.cargo_id).toBeGreaterThan(0);
  expect(b.cargo_id).toBeGreaterThan(0);

  expect(a.cargo_id).not.toEqual(b.cargo_id);

  expect(a).toMatchObject({ origin: "FACTORY", destination: "A" });
  expect(b).toMatchObject({ origin: "FACTORY", destination: "B" });
});
