import { Duration, Time } from "./Time";

export class Vehicle {
  public available: Time = 0;

  public book(desiredDeparture: Time, travelTime: Duration): Time {
    const departure = Math.max(this.available, desiredDeparture);
    const arrival = departure + travelTime;
    this.available = arrival + travelTime;
    return arrival;
  }
}
