import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { Location } from "./Location";
import { getTourPlaner } from "./routing";
import { Time } from "./Time";
import { TourPlan } from "./TourPlaner";
import { TourPublisher } from "./TourPublisher";

export class Vehicle {
  public available: Time = 0;

  private schedule?: { loading: Time; origin: Location; destination: Location; cargo: Cargo[]; tourPlan: TourPlan };
  private readonly tourPublisher: TourPublisher;

  constructor(kind: string, private capacity: number, eventStore: EventStore) {
    this.tourPublisher = new TourPublisher(kind, eventStore);
  }

  public book(arrivalAtOrigin: Time, origin: Location, destination: Location, cargo: Cargo): Time {
    if (this.scheduleMismatches(arrivalAtOrigin, origin, destination)) {
      this.makeJourney();
    }

    this.scheduleCargo(arrivalAtOrigin, origin, destination, cargo);
    const { cargoAvailableDestination } = this.schedule!.tourPlan;

    if (this.capacityExhausted()) {
      this.makeJourney();
    }

    return cargoAvailableDestination;
  }

  public closeBooking(): void {
    if (this.schedule) {
      this.makeJourney();
    }
  }

  private capacityExhausted(): boolean {
    return (this.schedule?.cargo.length ?? 0) >= this.capacity;
  }

  private scheduleMismatches(arrivalAtOrigin: Time, origin: Location, destination: Location): boolean {
    return (
      !!this.schedule &&
      (this.schedule.loading < arrivalAtOrigin ||
        this.schedule.origin !== origin ||
        this.schedule.destination !== destination)
    );
  }

  private scheduleCargo(arrivalAtOrigin: Time, origin: Location, destination: Location, cargo: Cargo): void {
    if (this.schedule) {
      this.schedule.cargo.push(cargo);
    } else {
      const loading = Math.max(this.available, arrivalAtOrigin);
      const tourPlaner = getTourPlaner(origin, destination);
      const tourPlan = tourPlaner.schedule(loading);
      this.schedule = { loading, origin, destination, cargo: [cargo], tourPlan };
    }
  }

  private makeJourney(): void {
    const { origin, destination, cargo, tourPlan } = this.schedule!;
    this.tourPublisher.publish(origin, destination, tourPlan, cargo);
    this.available = tourPlan.returnArrival;
    delete this.schedule;
  }
}
