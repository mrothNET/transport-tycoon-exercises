import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { Location } from "./Location";
import { travelDuration } from "./routing";
import { Time } from "./Time";

export class Vehicle {
  public available: Time = 0;

  private eventStore: EventStore;
  private kind: string;
  private origin: Location;

  constructor(kind: string, origin: Location, eventStore: EventStore) {
    this.kind = kind;
    this.origin = origin;
    this.eventStore = eventStore;
  }

  public book(desiredDeparture: Time, destination: Location, cargo: Cargo): Time {
    const travel = travelDuration(this.origin, destination);
    const departure = Math.max(this.available, desiredDeparture);
    const arrival = departure + travel;
    this.available = arrival + travel;

    const metadata = { transport_id: this.eventStore.createUniqueTransportID(), kind: this.kind };

    this.eventStore.push(
      { ...metadata, event: "DEPART", time: departure, location: this.origin, destination, cargo: [cargo] },
      { ...metadata, event: "ARRIVE", time: arrival, location: destination, cargo: [cargo] },
      { ...metadata, event: "DEPART", time: arrival, location: destination, destination: this.origin },
      { ...metadata, event: "ARRIVE", time: this.available, location: this.origin },
    );

    return arrival;
  }
}
