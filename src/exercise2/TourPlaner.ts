import { Duration, Time } from "./Time";

export interface TourPlan {
  loading?: Time;
  departure: Time;
  arrival: Time;
  unload?: Time;
  returnDeparture: Time;
  returnArrival: Time;
}

export interface TourPlaner {
  schedule(startTime: Time): TourPlan;
}

export class SimpleTourPlaner implements TourPlaner {
  private readonly travelTime: Duration;

  constructor(travel: Duration) {
    this.travelTime = travel;
  }

  public schedule(startTime: Time): TourPlan {
    const departure = startTime;
    const arrival = departure + this.travelTime;
    const returnDeparture = arrival;
    const returnArrival = returnDeparture + this.travelTime;

    return { departure, arrival, returnDeparture, returnArrival };
  }
}

export class LoadingTourPlaner implements TourPlaner {
  private readonly loadingTime: Duration;
  private readonly travelTime: Duration;
  private readonly unloadingTime: Duration;

  constructor(loading: Duration, travel: Duration, unloading: Duration) {
    this.loadingTime = loading;
    this.travelTime = travel;
    this.unloadingTime = unloading;
  }

  public schedule(startTime: Time): TourPlan {
    const loading = startTime;
    const departure = loading + this.loadingTime;
    const arrival = departure + this.travelTime;
    const unload = arrival + this.unloadingTime;
    const returnDeparture = unload;
    const returnArrival = returnDeparture + this.travelTime;

    return { loading, departure, arrival, unload, returnDeparture, returnArrival };
  }
}
