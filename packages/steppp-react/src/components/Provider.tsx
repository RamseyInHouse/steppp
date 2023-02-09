import Steppp from "@ramseyinhouse/steppp";
import { useLayoutEffect, useRef, useState } from "react";
import { StepppContext, stubbedMethods } from "../context";

interface WrapperProps {
  children(instance: StepppInstance): JSX.Element[] | JSX.Element;
  [key: string]: any;
}

export interface StepppInstance {
  moveTo: (stepName: string) => void;
  forward: () => void;
  backward: () => void;
}

const baseCss = `
    [data-steppp-wrapper] {
        position: relative;
        overflow: hidden;
    }

    [data-steppp-active] {
        display: block;
    }

    section {
        position: absolute;
        display: none;
        left: 0;
    }
`;

export function Provider({ children, ...rest }: WrapperProps) {
  const stepRef = useRef<HTMLDivElement>(null);
  const [stepppInstance, setStepppInstance] = useState<StepppInstance>(
    null as unknown as StepppInstance
  );

  useLayoutEffect(() => {
    if (stepppInstance || !stepRef.current) return;

    setStepppInstance(Steppp(stepRef.current));
  }, []);

  return (
    <StepppContext.Provider value={stepppInstance || stubbedMethods}>
      <style>{baseCss}</style>

      <div ref={stepRef} style={{ position: "relative" }} {...rest}>
        {children(stepppInstance || {})}
      </div>
    </StepppContext.Provider>
  );
}
