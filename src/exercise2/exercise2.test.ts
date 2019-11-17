import { exercise2 } from "./exercise2";
import { Cargo } from "./Cargo";

test('exercise2("B")', () => {
  const events = exercise2("B");
  expect(events.length).toEqual(4);

  const transport_id = events[0].transport_id;
  expect(Number.isInteger(transport_id)).toBe(true);
  expect(transport_id).not.toEqual(0);

  const cargo = events[0].cargo as Cargo[];
  expect(cargo.length).toEqual(1);
  expect(Number.isInteger(cargo[0].cargo_id)).toBe(true);
  expect(cargo[0].cargo_id).not.toEqual(0);
  expect(cargo[0]).toMatchObject({ origin: "FACTORY", destination: "B" });

  expect(events[0]).toMatchObject({ transport_id, time: 0, event: "DEPART", kind: "TRUCK", location: "FACTORY", destination: "B", cargo }); // prettier-ignore
  expect(events[1]).toMatchObject({ transport_id, time: 5, event: "ARRIVE", kind: "TRUCK", location: "B", cargo });
  expect(events[2]).toMatchObject({ transport_id, time: 5, event: "DEPART", kind: "TRUCK", location: "B", destination: "FACTORY" }); // prettier-ignore
  expect(events[3]).toMatchObject({ transport_id, time: 10, event: "ARRIVE", kind: "TRUCK", location: "FACTORY" });

  expect(events[1].destination).toBeUndefined();
  expect(events[3].destination).toBeUndefined();

  expect(events[2].cargo).toBeUndefined();
  expect(events[3].cargo).toBeUndefined();
});
