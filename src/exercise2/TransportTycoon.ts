import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { TourPublisher } from "./TourPublisher";
import { Vehicle } from "./Vehicle";

export class TransportTycoon {
  private eventStore: EventStore;
  private trucks: Vehicle[];
  private ship: Vehicle;

  constructor() {
    this.eventStore = new EventStore();

    const truckPublisher = new TourPublisher("TRUCK", this.eventStore);
    const shipPublisher = new TourPublisher("SHIP", this.eventStore);

    this.trucks = [new Vehicle(1, truckPublisher), new Vehicle(1, truckPublisher)];
    this.ship = new Vehicle(4, shipPublisher);
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
