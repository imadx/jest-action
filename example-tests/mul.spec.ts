import { mul } from "./mul";

describe("mul", () => {
  it("should return multiple of given inputs", () => {
    expect(mul(1, 2)).toEqual(2);
  });
});
