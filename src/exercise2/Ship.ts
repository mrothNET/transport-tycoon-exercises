import { Cargo } from "./Cargo";
import { Location } from "./Location";
import { getTourPlaner } from "./routing";
import { Time } from "./Time";
import { TourPublisher } from "./TourPublisher";

export class Ship {
  public loading: Time = 0;

  private origin: Location;
  private destination: Location;
  private capacity: number;
  private cargo: Cargo[] = [];

  private publisher: TourPublisher;

  constructor(origin: Location, destination: Location, capacity: number, tourPublisher: TourPublisher) {
    this.origin = origin;
    this.destination = destination;
    this.capacity = capacity;
    this.publisher = tourPublisher;
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
    const planer = getTourPlaner(this.origin, this.destination);
    const plan = planer.schedule(this.loading);
    this.publisher.publish(this.origin, this.destination, plan, this.cargo);
    this.loading = plan.returnArrival;
    this.cargo = [];
  }
}
