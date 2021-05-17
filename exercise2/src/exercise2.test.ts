import { Cargo } from "./Cargo";
import { exercise2 } from "./exercise2";

test('exercise2("B")', () => {
  const events = exercise2("B");
  expect(events.length).toEqual(6);

  const transport_id = events[0].transport_id;
  expect(Number.isInteger(transport_id)).toBe(true);
  expect(transport_id).not.toEqual(0);

  const cargo = events[0].cargo as Cargo[];
  expect(cargo.length).toEqual(1);
  expect(Number.isInteger(cargo[0].cargo_id)).toBe(true);
  expect(cargo[0].cargo_id).not.toEqual(0);
  expect(cargo[0]).toMatchObject({ origin: "FACTORY", destination: "B" });

  expect(events[1]).toMatchObject({ transport_id, time: 0, event: "DEPART", kind: "TRUCK", location: "FACTORY", destination: "B", cargo }); // prettier-ignore
  expect(events[2]).toMatchObject({ transport_id, time: 5, event: "ARRIVE", kind: "TRUCK", location: "B", cargo });
  expect(events[4]).toMatchObject({ transport_id, time: 5, event: "DEPART", kind: "TRUCK", location: "B", destination: "FACTORY" }); // prettier-ignore
  expect(events[5]).toMatchObject({ transport_id, time: 10, event: "ARRIVE", kind: "TRUCK", location: "FACTORY" });

  expect(events[2].destination).toBeUndefined();
  expect(events[5].destination).toBeUndefined();

  expect(events[4].cargo).toBeUndefined();
  expect(events[5].cargo).toBeUndefined();
});

test("updated ship rules", () => {
  const events = exercise2("ABA");

  // @ts-ignore
  const firstCargoId = events[0].cargo[0].cargo_id;
  const secondCargoId = firstCargoId + 1;
  const thirdCargoId = secondCargoId + 1;

  const events1 = events.filter((e) => e.cargo && e.cargo[0].cargo_id === firstCargoId);
  expect(events1.map((e) => e.event)).toEqual([
    "LOAD",
    "DEPART",
    "ARRIVE",
    "UNLOAD",
    "LOAD",
    "DEPART",
    "ARRIVE",
    "UNLOAD",
  ]);
  expect(events1.map((e) => e.time)).toEqual([0, 0, 1, 1, 1, 2, 8, 8]);

  const events3 = events.filter((e) => e.cargo && e.cargo[0].cargo_id === thirdCargoId);
  expect(events3.map((e) => e.event)).toEqual([
    "LOAD",
    "DEPART",
    "ARRIVE",
    "UNLOAD",
    "LOAD",
    "DEPART",
    "ARRIVE",
    "UNLOAD",
  ]);
  expect(events3.map((e) => e.time)).toEqual([2, 2, 3, 3, 15, 16, 22, 22]);
});

test('exercise2("AABABBAB")', () => {
  expect(exercise2("A")).toMatchSnapshot();
  expect(exercise2("B")).toMatchSnapshot();
  expect(exercise2("AA")).toMatchSnapshot();
  expect(exercise2("BB")).toMatchSnapshot();
  expect(exercise2("AB")).toMatchSnapshot();
  expect(exercise2("BA")).toMatchSnapshot();
  expect(exercise2("AABABBAB")).toMatchSnapshot();
});
