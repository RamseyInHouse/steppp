import React from "react";
import { Provider, Wrapper, Step, useSteppp } from "../src/index";
import { SubStep } from "./SubStep";

function App() {
  return (
    <Provider>
      {({ moveTo, forward, backward }) => (
        <>
          <Wrapper>
            <Step initialActive>
              one
              <button onClick={() => moveTo("fourth")}>Go to fourth</button>
            </Step>
            <SubStep>two</SubStep>
            <Step name="third">three</Step>
            <Step name="fourth">fourth</Step>
          </Wrapper>

          <button onClick={forward}>Forward</button>
          <button onClick={backward}>Backward</button>
        </>
      )}
    </Provider>
  );
}

export { App };
