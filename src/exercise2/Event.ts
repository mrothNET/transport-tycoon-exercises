import { Cargo } from "./Cargo";
import { Location } from "./Location";
import { Time } from "./Time";

export type EventType = "DEPART" | "ARRIVE";

export interface Event {
  event: EventType;
  time: Time;
  transport_id: number;
  kind: string;
  location: Location;
  destination?: Location;
  cargo?: Cargo[];
}
