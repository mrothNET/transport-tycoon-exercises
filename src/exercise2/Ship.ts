import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { Location } from "./Location";
import { Time } from "./Time";

const LOADING_DURATION = 1;
const UNLOADING_DURATION = 1;
const TRAVEL_DURATION = 6;

export class Ship {
  public loading: Time = 0;

  private origin: Location;
  private destination: Location;

  private cargo: Cargo[] = [];
  private capacity: number;

  private eventStore: EventStore;

  constructor(origin: Location, destination: Location, capacity: number, eventStore: EventStore) {
    this.origin = origin;
    this.destination = destination;
    this.capacity = capacity;
    this.eventStore = eventStore;
  }

  public book(arrivalAtPort: Time, cargo: Cargo): void {
    this.loading = Math.max(this.loading, arrivalAtPort);
    this.cargo.push(cargo);

    if (this.cargo.length === this.capacity) {
      this.makeJourney();
    }
  }

  public closeBooking(): void {
    if (this.cargo.length !== 0) {
      this.makeJourney();
    }
  }

  private makeJourney(): void {
    const loading = this.loading;
    const departure = loading + LOADING_DURATION;
    const arrival = departure + TRAVEL_DURATION;
    const unload = arrival + UNLOADING_DURATION;
    const back = unload + TRAVEL_DURATION;

    // tslint:disable-next-line: variable-name
    const transport_id = this.eventStore.createUniqueTransportID();

    const kind = "SHIP";
    const origin = this.origin;
    const destination = this.destination;
    const cargo = this.cargo;

    const metadata = { transport_id, kind };

    this.eventStore.push(
      { ...metadata, event: "LOAD", time: loading, location: origin, destination, cargo },
      { ...metadata, event: "DEPART", time: departure, location: origin, destination, cargo },
      { ...metadata, event: "ARRIVE", time: arrival, location: destination, cargo },
      { ...metadata, event: "UNLOAD", time: unload, location: destination, cargo },
      { ...metadata, event: "DEPART", time: unload, location: destination, destination: origin },
      { ...metadata, event: "ARRIVE", time: back, location: origin },
    );

    this.loading = back;
    this.cargo = [];
  }
}
