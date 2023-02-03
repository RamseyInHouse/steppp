import React, { useContext } from "react";
import { StepppInstance } from "./components/Provider";

export const stubbedMethods = {
  forward: () => {},
  backward: () => {},
  moveTo: () => {},
};

export const StepppContext =
  React.createContext<StepppInstance>(stubbedMethods);

export function useSteppp() {
  return useContext(StepppContext);
}
