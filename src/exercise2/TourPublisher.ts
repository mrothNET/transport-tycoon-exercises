import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { Location } from "./Location";
import { TourPlan } from "./TourPlaner";

export class TourPublisher {
  private readonly kind: string;
  private readonly eventStore: EventStore;

  constructor(kind: string, eventStore: EventStore) {
    this.kind = kind;
    this.eventStore = eventStore;
  }

  public publish(origin: Location, destination: Location, tourPlan: TourPlan, cargo: Cargo[]): void {
    const metadata = { transport_id: this.eventStore.createUniqueTransportID(), kind: this.kind };

    if (tourPlan.loading) {
      this.eventStore.push({ ...metadata, event: "LOAD", time: tourPlan.loading, location: origin, destination, cargo }); // prettier-ignore
    }

    this.eventStore.push(
      { ...metadata, event: "DEPART", time: tourPlan.departure, location: origin, destination, cargo },
      { ...metadata, event: "ARRIVE", time: tourPlan.arrival, location: destination, cargo },
    );

    if (tourPlan.unload) {
      this.eventStore.push({ ...metadata, event: "UNLOAD", time: tourPlan.unload, location: destination, cargo });
    }

    this.eventStore.push(
      { ...metadata, event: "DEPART", time: tourPlan.returnDeparture, location: destination, destination: origin },
      { ...metadata, event: "ARRIVE", time: tourPlan.returnArrival, location: origin },
    );
  }
}
