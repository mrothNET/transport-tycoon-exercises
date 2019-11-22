import { Cargo } from "./Cargo";
import { Location } from "./Location";
import { travelDuration } from "./routing";
import { Time } from "./Time";
import { TourPlaner } from "./TourPlaner";
import { TourPublisher } from "./TourPublisher";

export class Vehicle {
  public available: Time = 0;

  private publisher: TourPublisher;

  constructor(tourPublisher: TourPublisher) {
    this.publisher = tourPublisher;
  }

  public book(origin: Location, destination: Location, cargo: Cargo): Time {
    const travel = travelDuration(origin, destination);
    const planer = new TourPlaner(travel);
    const plan = planer.schedule(this.available);
    this.publisher.publish(origin, destination, plan, [cargo]);
    this.available = plan.returnArrival;
    return plan.arrival;
  }
}
