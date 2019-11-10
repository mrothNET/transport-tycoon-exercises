type Time = number;
type Duration = number;

class Vehicle {
  public available: Time = 0;

  public book(desiredDeparture: Time, travelTime: Duration): Time {
    const departure = Math.max(this.available, desiredDeparture);
    const arrival = departure + travelTime;
    this.available = arrival + travelTime;
    return arrival;
  }
}

type Destination = "A" | "B";
const isDestination = ["A", "B"].includes as (x: string) => x is Destination;

class TransportTycoon {
  private truckToPort = 1;
  private shipToA = 4;
  private truckToB = 5;

  private trucks = Array.from(Array(2), () => new Vehicle());
  private ship = new Vehicle();

  public book(destination: Destination): Time {
    switch (destination) {
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
      if (candidate.available < chosen.available) {
        return candidate;
      } else {
        return chosen;
      }
    });
  }
}

function exercise1(cargoList: string): Time {
  const tt = new TransportTycoon();

  const deliverTimes = cargoList
    .toUpperCase()
    .split("")
    .filter(isDestination)
    .map(tt.book);

  return Math.max(...deliverTimes);
}

function test1() {
  const testVectors: Array<[string, Time]> = [
    ["A", 5],
    ["B", 5],
    ["AA", 13],
    ["BB", 5],
    ["AB", 5],
    ["BA", 5],
    ["ABB", 7],
  ];

  let failed = 0;

  for (const test of testVectors) {
    const [cargoList, expected] = test;
    const actual = exercise1(cargoList);
    if (actual === expected) {
      console.log(`PASS: exercise1("${cargoList}") === ${expected}`);
    } else {
      console.log(`FAIL: exercise1("${cargoList}") !== ${expected}, but was ${actual}`);
      failed += 1;
    }
  }

  return failed > 0 ? 1 : 0;
}

const [bin, script, ...args] = process.argv;

if (args.length > 0) {
  for (const cargoList of args) {
    const actual = exercise1(cargoList);
    console.log(`exercise1("${cargoList}") === ${actual}`);
  }
  process.exit(0);
} else {
  process.exit(test1());
}
