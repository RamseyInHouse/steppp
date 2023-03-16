import React from "react";
import { Provider, Wrapper, Step } from "../src/index";
import { SubStep } from "./SubStep";

const options = {
  frames: {
    enter: [
      { transform: "rotate(0deg)", opacity: 0 },
      { transform: "rotate(360deg)", opacity: 1 },
    ],
    exit: [
      { transform: "rotate(360deg)", opacity: 1 },
      { transform: "rotate(0deg)", opacity: 0 },
    ],
  }
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
