import Steppp from "@ramseyinhouse/steppp";
import type { Instance, Options } from "@ramseyinhouse/steppp/dist/types";
import { useLayoutEffect, useRef, useState } from "react";
import { StepppContext, stubbedMethods } from "../context";

interface ProviderProps {
  children(instance: Instance): JSX.Element[] | JSX.Element;
  options?: Partial<Options>;
  [key: string]: any;
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

export function Provider({ children, options = {}, ...rest }: ProviderProps) {
  const stepRef = useRef<HTMLDivElement>(null);
  const [stepppInstance, setStepppInstance] = useState<Instance>(
    null as unknown as Instance
  );

  useLayoutEffect(() => {
    if (stepppInstance || !stepRef.current) return;

    setStepppInstance(Steppp(stepRef.current, options));
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
