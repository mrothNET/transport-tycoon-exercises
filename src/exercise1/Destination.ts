export type Destination = "A" | "B";

export const destinations = ["A", "B"];

export function isDestination(destination: string): destination is Destination {
  return destinations.includes(destination);
}

export function stringToDestination(destination: string): Destination {
  const result = destination.toUpperCase();
  if (!isDestination(result)) {
    throw new Error("Unknown destination");
  }
  return result;
}
