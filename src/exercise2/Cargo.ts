import { Destination } from "./Destination";
import { Location } from "./Location";

let numCargos = 0;

export class Cargo {
  // tslint:disable-next-line: variable-name
  public readonly cargo_id: number;
  public readonly origin: Location;
  public readonly destination: Destination;

  constructor(origin: Location, destination: Destination) {
    this.cargo_id = ++numCargos;
    this.origin = origin;
    this.destination = destination;
  }
}
