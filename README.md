# Transport Tycoon Exercises

Some DDD exercises. See: [Softwarepark/exercises
](https://github.com/Softwarepark/exercises/blob/master/transport-tycoon.md)


Language used: [TypeScript](https://www.typescriptlang.org/).

## Exercise #1

Core parts of my solution:

```typescript
function exercise1(cargoList: string): Time {
  const tt = new TransportTycoon();

  const deliverTimes = cargoList
    .split("")
    .map(nameToDestination)
    .map(destination => tt.book(destination));

  return Math.max(...deliverTimes);
}

class TransportTycoon {
  private truckToPort: Duration = 1;
  private shipToA: Duration = 4;
  private truckToB: Duration = 5;

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
      return candidate.available < chosen.available ? candidate : chosen;
    });
  }
}

class Vehicle {
  public available: Time = 0;

  public book(desiredDeparture: Time, travelTime: Duration): Time {
    const departure = Math.max(this.available, desiredDeparture);
    const arrival = departure + travelTime;
    this.available = arrival + travelTime;
    return arrival;
  }
}
```

## Author

  * [Michael Roth](https://mroth.net/) [<<mail@mroth.net>>](mailto:mail@mroth.net)

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
