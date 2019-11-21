import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { TourPlan } from "./TourPlaner";
import { TourPublisher } from "./TourPublisher";

test("Events for a simple tour", () => {
  const evs = new EventStore();
  const publisher = new TourPublisher("TEST", evs);

  const plan: TourPlan = {
    departure: 1,
    arrival: 2,
    returnDeparture: 3,
    returnArrival: 4,
  };

  publisher.publish("A", "B", plan, [] as Cargo[]);

  const events = evs.getAllEvents();

  expect(events.map(e => e.kind)).toEqual(["TEST", "TEST", "TEST", "TEST"]);
  expect(events.map(e => e.event)).toEqual(["DEPART", "ARRIVE", "DEPART", "ARRIVE"]);
  expect(events.map(e => e.location)).toEqual(["A", "B", "B", "A"]);
  expect(events.map(e => e.time)).toEqual([1, 2, 3, 4]);

  expect(events[0].destination).toEqual("B");
  expect(events[1].destination).toBeUndefined();
  expect(events[2].destination).toEqual("A");
  expect(events[3].destination).toBeUndefined();

  expect(events[0].cargo).toEqual([]);
  expect(events[1].cargo).toEqual([]);
  expect(events[2].cargo).toBeUndefined();
  expect(events[3].cargo).toBeUndefined();
});

test("Events for a load/unload tour", () => {
  const evs = new EventStore();
  const publisher = new TourPublisher("TEST", evs);

  const plan: TourPlan = {
    loading: 1,
    departure: 2,
    arrival: 3,
    unload: 4,
    returnDeparture: 5,
    returnArrival: 6,
  };

  publisher.publish("A", "B", plan, [] as Cargo[]);

  const events = evs.getAllEvents();

  expect(events.map(e => e.kind)).toEqual(["TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]);
  expect(events.map(e => e.event)).toEqual(["LOAD", "DEPART", "ARRIVE", "UNLOAD", "DEPART", "ARRIVE"]);
  expect(events.map(e => e.location)).toEqual(["A", "A", "B", "B", "B", "A"]);
  expect(events.map(e => e.time)).toEqual([1, 2, 3, 4, 5, 6]);

  expect(events[0].destination).toEqual("B");
  expect(events[1].destination).toEqual("B");
  expect(events[2].destination).toBeUndefined();
  expect(events[3].destination).toBeUndefined();
  expect(events[4].destination).toEqual("A");
  expect(events[5].destination).toBeUndefined();

  expect(events[0].cargo).toEqual([]);
  expect(events[1].cargo).toEqual([]);
  expect(events[2].cargo).toEqual([]);
  expect(events[3].cargo).toEqual([]);
  expect(events[4].cargo).toBeUndefined();
  expect(events[5].cargo).toBeUndefined();
});
