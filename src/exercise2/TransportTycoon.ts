import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { Duration, Time } from "./Time";
import { Vehicle } from "./Vehicle";

export class TransportTycoon {
  private truckToPort: Duration = 1;
  private shipToA: Duration = 4;
  private truckToB: Duration = 5;

  private eventStore: EventStore;

  private trucks: Vehicle[];
  private ship: Vehicle;

  constructor() {
    this.eventStore = new EventStore();
    this.trucks = Array.from(Array(2), () => new Vehicle("TRUCK", "FACTORY", this.eventStore));
    this.ship = new Vehicle("SHIP", "PORT", this.eventStore);
  }

  public getAllEvents() {
    return this.eventStore.getAllEvents();
  }

  public book(cargo: Cargo): Time {
    switch (cargo.destination) {
      case "A":
        const arrivalAtPort = this.firstAvailableTruck().book(0, this.truckToPort, "PORT", [cargo]);
        const arrivalAtA = this.ship.book(arrivalAtPort, this.shipToA, "A", [cargo]);
        return arrivalAtA;

      case "B":
        const arrivalAtB = this.firstAvailableTruck().book(0, this.truckToB, "B", [cargo]);
        return arrivalAtB;
    }
  }

  private firstAvailableTruck(): Vehicle {
    return this.trucks.reduce((chosen, candidate) => {
      return candidate.available < chosen.available ? candidate : chosen;
    });
  }
}
