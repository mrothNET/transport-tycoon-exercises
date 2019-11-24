import { Duration, Time } from "./Time";

export interface TourPlan {
  startTime: Time;
  loadingDuration: Duration;
  departure: Time;
  arrival: Time;
  unloadDuration: Duration;
  returnDeparture: Time;
  returnArrival: Time;
  cargoAvailableDestination: Time;
}

export class TourPlaner {
  private readonly loading: Duration;
  private readonly travel: Duration;
  private readonly unloading: Duration;

  constructor(travel: Duration);
  constructor(loading: Duration, travel: Duration, unloading: Duration);

  constructor(a: Duration, b?: Duration, c?: Duration) {
    const oneArg = b === undefined && c === undefined;

    this.loading = oneArg ? 0 : a;
    this.travel = oneArg ? a : b!;
    this.unloading = oneArg ? 0 : c!;
  }

  public schedule(startTime: Time): TourPlan {
    const loadingDuration = this.loading;

    const departure = startTime + loadingDuration;
    const arrival = departure + this.travel;

    const unloadDuration = this.unloading;

    const cargoAvailableDestination = arrival + unloadDuration;

    const returnDeparture = cargoAvailableDestination;
    const returnArrival = returnDeparture + this.travel;

    return {
      startTime,
      loadingDuration,
      departure,
      arrival,
      unloadDuration,
      returnDeparture,
      returnArrival,
      cargoAvailableDestination,
    };
  }
}
