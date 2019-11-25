# Exercise #2

Task was to write a program that outputs domain events in form of JSON objects. This event log gets converted with a supplied python script to display the events in Chrome with its tracing tool:

* [Event logs](log)
* [Trace files](trace) (for Chrome)

It was stated to log an entry when important domain event happens. It was not required to build onto the events yourself.



## Issues Encountered

It was not clear in the beginning if a ship should wait to be completely full or not. I decided wrong and had to rework my solution after this issue was clarified.

The definition of the LOAD and UNLOAD events was postponed. So I assumed the wrong semantic and had to rework my solution. During rework I missed a detail and had to do a second rework.

I misinterpreted the semantic of `transport_id`. Thought it was a unique ID for each delivery. But comparing the example screenshots it turned out that `transport_id` should be a unique ID for each vehicle (truck and ship). So once more a rework was necessary.



## Implementation

My solution is written in TypeScript and the core uses about 160 lines of code:

```typescript
function exercise2(cargoList: string): Event[] {
  const tt = new TransportTycoon();

  cargoList
    .split("")
    .map(stringToDestination)
    .map(destination => new Cargo("FACTORY", destination))
    .forEach(cargo => tt.book(cargo));

  tt.closeBooking();

  return tt.getAllEvents();
}

class TransportTycoon {
  private eventStore: EventStore;
  private trucks: Vehicle[];
  private ship: Vehicle;

  constructor() {
    this.eventStore = new EventStore();

    const makeTruck = () => new Vehicle("TRUCK", 1, this.eventStore);
    const makeShip = () => new Vehicle("SHIP", 4, this.eventStore);

    this.trucks = [makeTruck(), makeTruck()];
    this.ship = makeShip();
  }

  public getAllEvents() {
    return this.eventStore.getAllEvents();
  }

  public book(cargo: Cargo): void {
    switch (cargo.destination) {
      case "A":
        const arrivalAtPort = this.firstAvailableTruck().book(0, "FACTORY", "PORT", cargo);
        this.ship.book(arrivalAtPort, "PORT", "A", cargo);
        break;

      case "B":
        this.firstAvailableTruck().book(0, "FACTORY", "B", cargo);
        break;
    }
  }

  public closeBooking(): void {
    this.ship.closeBooking();
  }

  private firstAvailableTruck(): Vehicle {
    return this.trucks.reduce((chosen, candidate) => {
      return candidate.available < chosen.available ? candidate : chosen;
    });
  }
}

class Vehicle {
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

function getTourPlaner(origin: Location, destination: Location): TourPlaner {
  return routingTable[origin][destination];
}

class TourPlaner {
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

    return { startTime, loadingDuration, departure, arrival, unloadDuration, returnDeparture, returnArrival, cargoAvailableDestination };
  }
}

class TourPublisher {
  private readonly transportId: number;

  constructor(private readonly kind: string, private readonly eventStore: EventStore) {
    this.transportId = ++numTransportIDs;
  }

  public publish(origin: Location, destination: Location, tourPlan: TourPlan, cargo: Cargo[]): void {
    const metadata = { transport_id: this.transportId, kind: this.kind };
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

class EventStore {
  private events: Event[] = [];
  private length = 0;

  public publish(...events: Event[]): void {
    this.events.push(...events);
  }

  public getAllEvents(): Event[] {
    if (this.events.length !== this.length) {
      this.events.sort(firstBy("time").thenBy(eventTypeOrder));
      this.length = this.events.length;
    }

    return Array.from(this.events);
  }
}
```
