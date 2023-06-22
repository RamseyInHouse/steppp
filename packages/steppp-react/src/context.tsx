import React, { useContext } from "react";
import type { Instance } from "@ramseyinhouse/steppp/dist/types";

export const stubbedMethods = {
  forward: () => Promise.resolve(),
  backward: () => Promise.resolve(),
  moveTo: () => Promise.resolve(),
};

export const StepppContext =
  React.createContext<Instance>(stubbedMethods);

export function useSteppp() {
  return useContext(StepppContext);
}
