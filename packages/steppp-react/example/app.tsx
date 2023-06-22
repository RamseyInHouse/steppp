import React from "react";
import { Provider, Wrapper, Step } from "../src/index";
import { SubStep } from "./SubStep";

const options = {
  frames: [{ opacity: "0" }, { opacity: "1" }],
}

function App() {
  return (
    <Provider options={options}>
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
