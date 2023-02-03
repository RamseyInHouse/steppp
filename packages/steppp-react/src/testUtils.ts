import { screen } from "@testing-library/react";

export function afterStepMove(cb: () => void) {
  screen
    .getByTestId("stepppRoot")
    .addEventListener("steppp:complete", async () => {
      cb();
    });
}

export function afterStepAbort(cb: () => void) {
  screen
    .getByTestId("stepppRoot")
    .addEventListener("steppp:abort", async () => {
      cb();
    });
}
