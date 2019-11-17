import { firstBy } from "thenby";
import { Event } from "./Event";

let numTransportIDs = 0;

export class EventStore {
  private events: Event[] = [];
  private length = 0;

  public push(...events: Event[]): void {
    this.events.push(...events);
  }

  public getAllEvents(): Event[] {
    if (this.events.length !== this.length) {
      this.events.sort(compareEvents);
      this.length = this.events.length;
    }

    return Array.from(this.events);
  }

  public createUniqueTransportID(): number {
    return ++numTransportIDs;
  }
}

const compareEvents = firstBy("time").thenBy(e => eventTypeOrder[(e as Event).event] || 0);

const eventTypeOrder = {
  ARRIVE: -2,
  UNLOAD: -1,
  LOAD: 1,
  DEPART: 2,
};
