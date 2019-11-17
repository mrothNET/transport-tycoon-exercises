import { Cargo } from "./Cargo";
import { stringToDestination } from "./Destination";
import { Event } from "./Event";
import { TransportTycoon } from "./TransportTycoon";

export function exercise2(cargoList: string): Event[] {
  const tt = new TransportTycoon();

  cargoList
    .split("")
    .map(stringToDestination)
    .map(destination => new Cargo("FACTORY", destination))
    .forEach(cargo => tt.book(cargo));

  return tt.getAllEvents();
}
