import { sum } from "./sum";

describe("sum", () => {
  it("should return sum of given inputs", () => {
    expect(sum(1, 2)).toEqual(3);
  });
});
