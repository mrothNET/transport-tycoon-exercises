import { Cargo } from "./Cargo";
import { Location } from "./Location";
import { getTourPlaner } from "./routing";
import { Time } from "./Time";
import { TourPublisher } from "./TourPublisher";

export class Vehicle {
  public available: Time = 0;

  private publisher: TourPublisher;

  constructor(tourPublisher: TourPublisher) {
    this.publisher = tourPublisher;
  }

  public book(origin: Location, destination: Location, cargo: Cargo): Time {
    const planer = getTourPlaner(origin, destination);
    const plan = planer.schedule(this.available);
    this.publisher.publish(origin, destination, plan, [cargo]);
    this.available = plan.returnArrival;
    return plan.arrival;
  }
}
