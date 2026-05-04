import { randomInt as nodeRandomInt } from "node:crypto";
import type { RandomInt } from "../types";

export const cryptoRandomInt: RandomInt = (maxExclusive: number) => {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error("maxExclusive must be a positive integer");
  }

  return nodeRandomInt(maxExclusive);
};
