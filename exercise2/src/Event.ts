import { Cargo } from "./Cargo";
import { Location } from "./Location";
import { Duration, Time } from "./Time";

export type EventType = "LOAD" | "DEPART" | "ARRIVE" | "UNLOAD";

export interface Event {
  event: EventType;
  time: Time;
  duration?: Duration;
  transport_id: number;
  kind: string;
  location: Location;
  destination?: Location;
  cargo?: Cargo[];
}
