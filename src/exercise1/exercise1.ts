import { nameToDestination } from "./Destination";
import { Time } from "./Time";
import { TransportTycoon } from "./TransportTycoon";

export function exercise1(cargoList: string): Time {
  const tt = new TransportTycoon();

  const deliverTimes = cargoList
    .split("")
    .map(nameToDestination)
    .map(destination => tt.book(destination));

  return Math.max(...deliverTimes);
}
