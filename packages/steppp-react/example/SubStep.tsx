import React from "react";
import { Step, useSteppp } from "../src";

function SubStep({ children }) {
  const { forward, backward, moveTo } = useSteppp();

  return (
    <Step>
      {children}
      <button onClick={() => forward()}>forward</button>
    </Step>
  );
}

export { SubStep };
