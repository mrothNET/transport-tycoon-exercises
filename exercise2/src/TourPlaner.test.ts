import { TourPlaner } from "./TourPlaner";

test("Simple tour", () => {
  const planer = new TourPlaner(1);
  const tour = planer.schedule(0);

  expect(tour.cargoAvailableDestination).toEqual(1);
  expect(tour.returnArrival).toEqual(2);
});

test("Tour with loading", () => {
  const planer = new TourPlaner(1, 2, 0);
  const tour = planer.schedule(3);

  expect(tour.cargoAvailableDestination).toEqual(6);
  expect(tour.returnArrival).toEqual(8);
});

test("Full tour with loading and unloading", () => {
  const planer = new TourPlaner(2, 1, 3);
  const tour = planer.schedule(5);

  expect(tour.cargoAvailableDestination).toEqual(11);
  expect(tour.returnArrival).toEqual(12);
});
