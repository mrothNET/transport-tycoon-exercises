import { Cargo } from "./Cargo";
import { createUniqueTransportID, EventStore } from "./EventStore";
import { Location } from "./Location";
import { TourPlan } from "./TourPlaner";

export class TourPublisher {
  constructor(private readonly kind: string, private readonly eventStore: EventStore) {}

  public publish(origin: Location, destination: Location, tourPlan: TourPlan, cargo: Cargo[]): void {
    const metadata = { transport_id: createUniqueTransportID(), kind: this.kind };
    const { startTime, loadingDuration, departure, arrival, unloadDuration, returnDeparture, returnArrival } = tourPlan;

    this.eventStore.publish(
      { ...metadata, event: "LOAD", time: startTime, duration: loadingDuration, location: origin, destination, cargo },
      { ...metadata, event: "DEPART", time: departure, location: origin, destination, cargo },
      { ...metadata, event: "ARRIVE", time: arrival, location: destination, cargo },
      { ...metadata, event: "UNLOAD", time: arrival, duration: unloadDuration, location: destination, cargo },
      { ...metadata, event: "DEPART", time: returnDeparture, location: destination, destination: origin },
      { ...metadata, event: "ARRIVE", time: returnArrival, location: origin },
    );
  }
}
