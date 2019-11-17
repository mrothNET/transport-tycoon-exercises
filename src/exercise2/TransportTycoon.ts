import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { Ship } from "./Ship";
import { Duration } from "./Time";
import { Vehicle } from "./Vehicle";

const TRUCK_TO_PORT: Duration = 1;
const TRUCK_TO_B: Duration = 5;

export class TransportTycoon {
  private eventStore: EventStore;
  private trucks: Vehicle[];
  private ship: Ship;

  constructor() {
    this.eventStore = new EventStore();
    this.trucks = Array.from(Array(2), () => new Vehicle("TRUCK", "FACTORY", this.eventStore));
    this.ship = new Ship("PORT", "A", 4, this.eventStore);
  }

  public getAllEvents() {
    return this.eventStore.getAllEvents();
  }

  public book(cargo: Cargo): void {
    switch (cargo.destination) {
      case "A":
        const arrivalAtPort = this.firstAvailableTruck().book(0, TRUCK_TO_PORT, "PORT", cargo);
        this.ship.book(arrivalAtPort, cargo);
        break;

      case "B":
        this.firstAvailableTruck().book(0, TRUCK_TO_B, "B", cargo);
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
