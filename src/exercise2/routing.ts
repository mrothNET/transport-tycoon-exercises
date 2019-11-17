import { Location } from "./Location";
import { Duration } from "./Time";

const ROUTING_TABLE: { [origin: string]: { [destination: string]: Duration } } = {
  FACTORY: {
    PORT: 1,
    B: 5,
  },
  PORT: {
    A: 6,
  },
};

export function travelDuration(origin: Location, destination: Location): Duration {
  const routes = ROUTING_TABLE[origin];
  if (typeof routes !== "object") {
    throw new Error(`No routing available at: ${origin}`);
  }

  const duration = routes[destination];
  if (typeof duration !== "number") {
    throw new Error(`No routing available for destination ${destination} at ${origin}`);
  }

  return duration;
}
