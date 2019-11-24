import { Location } from "./Location";
import { TourPlaner } from "./TourPlaner";

const routingTable: { [origin: string]: { [destination: string]: TourPlaner } } = {
  FACTORY: {
    PORT: new TourPlaner(1),
    B: new TourPlaner(5),
  },
  PORT: {
    A: new TourPlaner(1, 6, 1),
  },
};

export function getTourPlaner(origin: Location, destination: Location): TourPlaner {
  return routingTable[origin][destination];
}
