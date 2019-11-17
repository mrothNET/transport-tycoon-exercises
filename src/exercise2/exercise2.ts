import { stringToDestination } from "./Destination";
import { Time } from "./Time";
import { TransportTycoon } from "./TransportTycoon";

export function exercise2(cargoList: string): Time {
  const tt = new TransportTycoon();

  const deliverTimes = cargoList
    .split("")
    .map(stringToDestination)
    .map(destination => tt.book(destination));

  return Math.max(...deliverTimes);
}
