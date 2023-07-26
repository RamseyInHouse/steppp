import React from "react";
import { Provider, Wrapper, Step } from "../src/index";
import { SubStep } from "./SubStep";

const options = {
  frames: [{ opacity: "0" }, { opacity: "1" }],
}

function App() {
  const [showExtraStep, setShowExtraStep] = React.useState(false);

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

            { showExtraStep && <Step name="dynamic_step">DYNAMIC</Step>}
          </Wrapper>

          <button onClick={forward}>Forward</button>
          <button onClick={backward}>Backward</button>

          <button onClick={() => setShowExtraStep(true)}>Show Extra Step</button>
          <button onClick={() => moveTo('dynamic_step')}>Go to Dynamic Step</button>
        </>
      )}
    </Provider>
  );
}

export { App };
