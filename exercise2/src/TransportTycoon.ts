import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { Vehicle } from "./Vehicle";

export class TransportTycoon {
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
