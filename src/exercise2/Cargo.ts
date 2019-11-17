import { Destination } from "./Destination";

let numCargos = 0;

export class Cargo {
  // tslint:disable-next-line: variable-name
  public readonly cargo_id: number;
  public readonly origin: string;
  public readonly destination: Destination;

  constructor(origin: string, destination: Destination) {
    this.cargo_id = ++numCargos;
    this.origin = origin;
    this.destination = destination;
  }
}
