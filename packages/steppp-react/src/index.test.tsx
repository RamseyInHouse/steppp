import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider, Step, useSteppp, Wrapper } from ".";
import { afterStepAbort, afterStepMove } from "./testUtils";

describe("Using standard implementation.", () => {
  const App = () => {
    return (
      <Provider data-testid="stepppRoot">
        {({ moveTo, forward, backward }) => (
          <>
            <Wrapper>
              <Step>
                one
                <button onClick={() => moveTo("fourth_step")}>
                  Move to Fourth
                </button>
              </Step>
              <Step data-steppp-active>two</Step>
              <Step>three</Step>
              <Step name="fourth_step">fourth</Step>
            </Wrapper>

            <button onClick={forward}>Forward</button>
            <button onClick={backward}>Backward</button>
          </>
        )}
      </Provider>
    );
  };

  it("Renders correctly.", () => {
    const { getByText } = render(<App />);
    const stepText = ["one", "two", "three"];
    const root = screen.getByTestId("stepppRoot");

    stepText.forEach((text) => {
      expect(getByText(text).tagName).toEqual("SECTION");
    });

    expect(root.style.position).toEqual("relative");
    expect(
      (root.querySelector("section[data-steppp-active]") as HTMLElement)?.style
        ?.position
    ).toBe("absolute");
    expect(getByText("two").getAttribute("data-steppp-active")).toEqual("true");
  });

  it("Moves to next step.", async () => {
    const { getByText } = render(<App />);

    await new Promise<void>((resolve) => {
      afterStepMove(() => {
        expect(getByText("two").getAttribute("data-steppp-active")).toEqual(
          null
        );
        expect(getByText("three").getAttribute("data-steppp-active")).toEqual(
          ""
        );
        resolve();
      });

      getByText("Forward").click();
    });
  });

  it("Moves to previous step.", async () => {
    const { getByText } = render(<App />);

    await new Promise<void>((resolve) => {
      afterStepMove(() => {
        expect(getByText("two").getAttribute("data-steppp-active")).toEqual(
          null
        );
        expect(getByText("one").getAttribute("data-steppp-active")).toEqual("");

        resolve();
      });

      getByText("Backward").click();
    });
  });

  it("Doesn't move when there's no next step.", async () => {
    const App = () => {
      return (
        <Provider data-testid="stepppRoot">
          {({ forward }) => (
            <>
              <Wrapper>
                <Step>one</Step>
                <Step initialActive={true}>three</Step>
              </Wrapper>

              <button onClick={forward}>Forward</button>
            </>
          )}
        </Provider>
      );
    };

    const { getByText } = render(<App />);

    await new Promise<void>((resolve) => {
      afterStepAbort(() => {
        expect(
          getByText("three").getAttribute("data-steppp-active")
        ).not.toEqual(undefined);
        resolve();
      });

      getByText("Forward").click();
    });
  });

  it("Doesn't move when there's no previous step.", async () => {
    const App = () => {
      return (
        <Provider data-testid="stepppRoot">
          {({ backward }) => (
            <>
              <Wrapper>
                <Step initialActive={true}>one</Step>
                <Step>three</Step>
              </Wrapper>

              <button onClick={backward}>Backward</button>
            </>
          )}
        </Provider>
      );
    };

    const { getByText } = render(<App />);

    await new Promise<void>((resolve) => {
      afterStepAbort(() => {
        expect(getByText("one").getAttribute("data-steppp-active")).not.toEqual(
          undefined
        );
        resolve();
      });

      getByText("Backward").click();
    });
  });

  it("Moves to named step.", async () => {
    const { getByText } = render(<App />);

    await new Promise<void>((resolve) => {
      afterStepMove(() => {
        expect(getByText("two").getAttribute("data-steppp-active")).toEqual(
          null
        );
        expect(getByText("fourth").getAttribute("data-steppp-active")).toEqual(
          ""
        );

        resolve();
      });

      getByText("Move to Fourth").click();
    });
  });
});

describe("Using context.", () => {
  const SubStep = ({ children, ...rest }: { children: any }) => {
    const { forward, backward, moveTo } = useSteppp();

    return (
      <Step {...rest}>
        {children}

        <button data-testid={`sub-step-${children}-forward`} onClick={forward}>
          Forward
        </button>

        <button onClick={() => moveTo("fourth_step")}>
          Move to Fourth - step: {children}
        </button>

        <button
          data-testid={`sub-step-${children}-backward`}
          onClick={backward}
        >
          Backward
        </button>
      </Step>
    );
  };

  const App = () => {
    return (
      <Provider data-testid="stepppRoot">
        {() => (
          <>
            <Wrapper>
              <SubStep>one</SubStep>
              <SubStep data-steppp-active>two</SubStep>
              <SubStep>three</SubStep>
              <Step name="fourth_step">fourth</Step>
            </Wrapper>
          </>
        )}
      </Provider>
    );
  };

  it("Moves to next step.", async () => {
    const { getByText } = render(<App />);

    await new Promise<void>((resolve) => {
      afterStepMove(() => {
        expect(getByText("two").getAttribute("data-steppp-active")).toEqual(
          null
        );
        expect(getByText("three").getAttribute("data-steppp-active")).toEqual(
          ""
        );
        resolve();
      });

      screen.getByTestId("sub-step-two-forward").click();
    });
  });

  it("Moves to previous step.", async () => {
    const { getByText } = render(<App />);

    await new Promise<void>((resolve) => {
      afterStepMove(() => {
        expect(getByText("two").getAttribute("data-steppp-active")).toEqual(
          null
        );
        expect(getByText("one").getAttribute("data-steppp-active")).toEqual("");
        resolve();
      });

      screen.getByTestId("sub-step-two-backward").click();
    });
  });

  it("Moves to named step.", async () => {
    const { getByText } = render(<App />);

    await new Promise<void>((resolve) => {
      afterStepMove(() => {
        expect(getByText("two").getAttribute("data-steppp-active")).toEqual(
          null
        );
        expect(getByText("fourth").getAttribute("data-steppp-active")).toEqual(
          ""
        );
        resolve();
      });

      getByText("Move to Fourth - step: two").click();
    });
  });
});
