# steppp-react

The React implementation of Steppp.

## Installation

Run `yarn add @ramseyinhouse/steppp-react` or `npm install @ramseyinhouse/steppp-react`.

## Usage

Import the `Provider`, `Wrapper`, and `Step` components from `@ramseyinhouse/steppp-react`. The `Provider` requires a child as a function that will provide methods for navigating through the experience. One of the steps _must_ have a `initialActive` prop on it.

```tsx
import { Provider, Wrapper, Step } from "@ramseyinhouse/steppp-react";

function App() {
  return (
    <Provider>
      {({ moveTo, forward, backward }) => (
        <>
          <Wrapper>
            <Step initialActive>one</Step>
            <Step>two</Step>
            <Step>three</Step>
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
