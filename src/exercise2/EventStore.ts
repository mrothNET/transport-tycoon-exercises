import { firstBy } from "thenby";
import { Event } from "./Event";

export class EventStore {
  private events: Event[] = [];
  private length = 0;

  public publish(...events: Event[]): void {
    this.events.push(...events);
  }

  public getAllEvents(): Event[] {
    if (this.events.length !== this.length) {
      this.events.sort(firstBy("time").thenBy(eventTypeOrder));
      this.length = this.events.length;
    }

    return Array.from(this.events);
  }
}

const eventTypeOrder = (e: object) => eventTypeOrdering[(e as Event).event] ?? 0;

const eventTypeOrdering = {
  ARRIVE: -2,
  UNLOAD: -1,
  LOAD: 1,
  DEPART: 2,
};
