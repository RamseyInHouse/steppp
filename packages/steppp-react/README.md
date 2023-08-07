# steppp-react

The React implementation of Steppp.

## Installation

Run `yarn add @ramseyinhouse/steppp-react` or `npm install @ramseyinhouse/steppp-react`.

## Usage

Import the `Provider`, `Wrapper`, and `Step` components from `@ramseyinhouse/steppp-react`. The `Provider` requires a child as a function that will provide methods for navigating through the experience. One of the steps _must_ have a `initialActive` prop on it, and _all_ steps must have a `name` prop.

```tsx
import { Provider, Wrapper, Step } from "@ramseyinhouse/steppp-react";

function App() {
  return (
    <Provider>
      {({ moveTo, forward, backward }) => (
        <>
          <Wrapper>
            <Step initialActive name="start">
              one
            </Step>
            <Step name="second">two</Step>
            <Step name="third">three</Step>
          </Wrapper>

          <button onClick={forward}>Forward</button>
          <button onClick={backward}>Backward</button>
        </>
      )}
    </Provider>
  );
}
```

### Context

A `useSteppp()` hook exists for leveraging navigation methods within any component nested within the `Provider` component.

```tsx
import { useSteppp, Step } from "@ramseyinhouse/steppp-react";

function SubStep({ children, ...rest }: { children: any }) {
  const { forward, backward, moveTo } = useSteppp();

  return (
    <Step {...rest}>
      {children}

      <button onClick={forward}>Move Forward</button>
    </Step>
  );
}
```

### Customizing the Animation

Steppp is powered by the Web Animations API. To customize the animation, you can pass either an array of frames, or an object with `enter` and `exit` properties. For more information, [see here](https://github.com/RamseyInHouse/steppp/tree/master/packages/steppp#customizing-the-animation).

```tsx
import { Provider, Wrapper, Step } from "@ramseyinhouse/steppp-react";

// Rotate the incoming & outgoing steps.
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
  },
};

function App() {
  return (
    <Provider options={options}>
      {({ moveTo, forward, backward }) => <>Steps go here...</>}
    </Provider>
  );
}
```
