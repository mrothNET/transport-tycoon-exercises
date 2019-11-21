import { LoadingTourPlaner, SimpleTourPlaner } from "./TourPlaner";

test("Simple tour", () => {
  const planer = new SimpleTourPlaner(1);
  const tour = planer.schedule(0);

  expect(tour.loading).toBeUndefined();
  expect(tour.departure).toEqual(0);
  expect(tour.arrival).toEqual(1);
  expect(tour.unload).toBeUndefined();
  expect(tour.returnDeparture).toEqual(1);
  expect(tour.returnArrival).toEqual(2);
});

test("Tour with loading", () => {
  const planer = new LoadingTourPlaner(1, 2, 0);
  const tour = planer.schedule(3);

  expect(tour.loading).toEqual(3);
  expect(tour.departure).toEqual(4);
  expect(tour.arrival).toEqual(6);
  expect(tour.unload).toEqual(6);
  expect(tour.returnDeparture).toEqual(6);
  expect(tour.returnArrival).toEqual(8);
});

test("Full tour with loading and unloading", () => {
  const planer = new LoadingTourPlaner(1, 2, 3);
  const tour = planer.schedule(3);

  expect(tour.loading).toEqual(3);
  expect(tour.departure).toEqual(4);
  expect(tour.arrival).toEqual(6);
  expect(tour.unload).toEqual(9);
  expect(tour.returnDeparture).toEqual(9);
  expect(tour.returnArrival).toEqual(11);
});
