import { Cargo } from "./Cargo";
import { Location } from "./Location";
import { getTourPlaner } from "./routing";
import { Time } from "./Time";
import { TourPublisher } from "./TourPublisher";

export class Ship {
  public available: Time = 0;

  private schedule?: { loading: Time; origin: Location; destination: Location; cargo: Cargo[] };
  private capacity: number;
  private publisher: TourPublisher;

  constructor(capacity: number, tourPublisher: TourPublisher) {
    this.capacity = capacity;
    this.publisher = tourPublisher;
  }

  public book(arrivalAtPort: Time, origin: Location, destination: Location, cargo: Cargo): void {
    if (this.scheduleMismatches(arrivalAtPort, origin, destination)) {
      this.makeJourney();
    }

    this.scheduleCargo(arrivalAtPort, origin, destination, cargo);

    if (this.capacityExhausted()) {
      this.makeJourney();
    }
  }

  public closeBooking(): void {
    if (this.schedule) {
      this.makeJourney();
    }
  }

  private capacityExhausted(): boolean {
    return (this.schedule?.cargo?.length ?? 0) >= this.capacity;
  }

  private scheduleMismatches(arrivalAtPort: Time, origin: Location, destination: Location): boolean {
    return (
      !!this.schedule &&
      (this.schedule.loading < arrivalAtPort ||
        this.schedule.origin !== origin ||
        this.schedule.destination !== destination)
    );
  }

  private scheduleCargo(arrivalAtPort: Time, origin: Location, destination: Location, cargo: Cargo): void {
    if (this.schedule) {
      this.schedule.cargo.push(cargo);
    } else {
      const loading = Math.max(this.available, arrivalAtPort);
      this.schedule = { loading, origin, destination, cargo: [cargo] };
    }
  }

  private makeJourney(): void {
    const { loading, origin, destination, cargo } = this.schedule!;

    const tourPlaner = getTourPlaner(origin, destination);
    const tourPlan = tourPlaner.schedule(loading);
    this.publisher.publish(origin, destination, tourPlan, cargo);
    this.available = tourPlan.returnArrival;

    delete this.schedule;
  }
}
