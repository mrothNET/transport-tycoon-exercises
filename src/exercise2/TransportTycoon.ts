import { Cargo } from "./Cargo";
import { Duration, Time } from "./Time";
import { Vehicle } from "./Vehicle";

export class TransportTycoon {
  private truckToPort: Duration = 1;
  private shipToA: Duration = 4;
  private truckToB: Duration = 5;

  private trucks = Array.from(Array(2), () => new Vehicle());
  private ship = new Vehicle();

  public book(cargo: Cargo): Time {
    switch (cargo.destination) {
      case "A":
        const arrivalAtPort = this.firstAvailableTruck().book(0, this.truckToPort);
        const arrivalAtA = this.ship.book(arrivalAtPort, this.shipToA);
        return arrivalAtA;

      case "B":
        const arrivalAtB = this.firstAvailableTruck().book(0, this.truckToB);
        return arrivalAtB;
    }
  }

  private firstAvailableTruck(): Vehicle {
    return this.trucks.reduce((chosen, candidate) => {
      return candidate.available < chosen.available ? candidate : chosen;
    });
  }
}
