import { stringToDestination } from "./Destination";
import { Time } from "./Time";
import { TransportTycoon } from "./TransportTycoon";
import { Cargo } from "./Cargo";

export function exercise2(cargoList: string): Time {
  const tt = new TransportTycoon();

  const deliverTimes = cargoList
    .split("")
    .map(stringToDestination)
    .map(destination => new Cargo("FACTORY", destination))
    .map(cargo => tt.book(cargo));

  return Math.max(...deliverTimes);
}
