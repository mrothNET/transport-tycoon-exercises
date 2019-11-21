import { Cargo } from "./Cargo";
import { EventStore } from "./EventStore";
import { Ship } from "./Ship";
import { TourPublisher } from "./TourPublisher";
import { Vehicle } from "./Vehicle";

export class TransportTycoon {
  private eventStore: EventStore;
  private trucks: Vehicle[];
  private ship: Ship;

  constructor() {
    this.eventStore = new EventStore();
    this.trucks = Array.from(Array(2), () => new Vehicle(new TourPublisher("TRUCK", this.eventStore)));
    this.ship = new Ship("PORT", "A", 4, new TourPublisher("SHIP", this.eventStore));
  }

  public getAllEvents() {
    return this.eventStore.getAllEvents();
  }

  public book(cargo: Cargo): void {
    switch (cargo.destination) {
      case "A":
        const arrivalAtPort = this.firstAvailableTruck().book("FACTORY", "PORT", cargo);
        this.ship.book(arrivalAtPort, cargo);
        break;

      case "B":
        this.firstAvailableTruck().book("FACTORY", "B", cargo);
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
