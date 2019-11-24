import { Duration, Time } from "./Time";

export interface TourPlan {
  loading?: Time;
  departure: Time;
  arrival: Time;
  unload?: Time;
  returnDeparture: Time;
  returnArrival: Time;
  cargoAvailableDestination: Time;
}

export class TourPlaner {
  private readonly loadUnload!: boolean;
  private readonly loading!: Duration;
  private readonly travel!: Duration;
  private readonly unloading!: Duration;

  constructor(travel: Duration);
  constructor(loading: Duration, travel: Duration, unloading: Duration);
  constructor(...args: Duration[]) {
    if (args.length === 1) {
      const [travel] = args;
      this.init(false, 0, travel, 0);
    } else if (args.length === 3) {
      const [loading, travel, unloading] = args;
      this.init(true, loading, travel, unloading);
    } else {
      throw new Error("Invalid number of arguments");
    }
  }

  public schedule(startTime: Time): TourPlan {
    const loading = startTime;
    const loadingComplete = loading + this.loading;

    const departure = loadingComplete;
    const arrival = departure + this.travel;

    const unload = arrival;
    const unloadComplete = unload + this.unloading;

    const cargoAvailableDestination = unloadComplete;

    const returnDeparture = unloadComplete;
    const returnArrival = returnDeparture + this.travel;

    if (this.loadUnload) {
      return { loading, departure, arrival, unload, returnDeparture, returnArrival, cargoAvailableDestination };
    } else {
      return { departure, arrival, returnDeparture, returnArrival, cargoAvailableDestination };
    }
  }

  private init(loadUnload: boolean, loading: Duration, travel: Duration, unloading: Duration): void {
    Object.assign(this, { loadUnload, loading, travel, unloading });
  }
}
