import { Destination } from "./Destination";
import { Location } from "./Location";

let numCargos = 0;

export class Cargo {
  // tslint:disable-next-line: variable-name
  public readonly cargo_id: number;

  // @ts-ignore
  constructor(public readonly origin: Location, public readonly destination: Destination) {
    this.cargo_id = ++numCargos;
  }
}
