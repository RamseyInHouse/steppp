import { getByText } from "@testing-library/dom";
import { getEl, getBody } from "./test-helpers";
import Steppp from "../index";
import { beforeEach, it, expect, describe } from "vitest";

declare global {
  interface Event {
    detail: any;
  }
}

beforeEach(() => {
  document.body.innerHTML = `
    <div id="steppp">
      <section data-steppp-active>1</section>
      <section>2</section>
      <section>3</section>
      <section>4</section>
      <section>5</section>
    </div>

    <button id="backward">
      backward
    </button>

    <button id="forward">
      forward
    </button>
  `;
});

const initialize = () => {
  const { forward, backward } = Steppp(getEl());

  getByText(getBody(), "backward").addEventListener("click", () => {
    backward();
  });

  getByText(getBody(), "forward").addEventListener("click", () => {
    forward();
  });
};

it("moves forward.", (): Promise<void> =>
  new Promise((done) => {
    initialize();

    getByText(getBody(), "forward").click();

    getEl().addEventListener("steppp:complete", () => {
      const el = getByText(getEl(), "2");
      expect(el.dataset.stepppActive).toEqual("");
      done();
    });
  }));

it("moves backward.", (): Promise<void> =>
  new Promise((done) => {
    getByText(getEl(), "1").removeAttribute("data-steppp-active");
    getByText(getEl(), "4").setAttribute("data-steppp-active", "");

    initialize();

    getByText(getBody(), "backward").click();

    getEl().addEventListener("steppp:complete", () => {
      const el = getByText(getEl(), "3");
      expect(el.dataset.stepppActive).toEqual("");
      done();
    });
  }));

it("moves to named step.", (): Promise<void> =>
  new Promise((done) => {
    getByText(getEl(), "3").setAttribute(
      "data-steppp-name",
      "slide_number_three"
    );

    const { moveTo } = Steppp(getEl());

    getByText(getBody(), "forward").addEventListener("click", () => {
      moveTo("slide_number_three");
    });

    getByText(getBody(), "forward").click();

    getEl().addEventListener("steppp:complete", () => {
      const el = getByText(getEl(), "3");
      expect(el.dataset.stepppActive).toEqual("");
      done();
    });
  }));

it("does not move forward when no steps are available", (): Promise<void> =>
  new Promise((done) => {
    getByText(getEl(), "1").removeAttribute("data-steppp-active");
    getByText(getEl(), "5").setAttribute("data-steppp-active", "");

    initialize();

    getByText(getBody(), "forward").click();

    getEl().addEventListener("steppp:abort", () => {
      const el = getByText(getEl(), "5");
      expect(el.dataset.stepppActive).toEqual("");
      done();
    });
  }));

it("does not move backward when no steps are available", (): Promise<void> =>
  new Promise((done) => {
    initialize();

    getByText(getBody(), "backward").click();

    getEl().addEventListener("steppp:abort", () => {
      const el = getByText(getEl(), "1");
      expect(el.dataset.stepppActive).toEqual("");
      done();
    });
  }));

describe("custom events", () => {
  it("fires event when step is starting to transition", (): Promise<void> =>
    new Promise((done) => {
      initialize();

      getByText(getBody(), "forward").click();

      getEl().addEventListener("steppp:start", (e) => {
        const { oldStep, newStep, element } = e.detail;

        expect(oldStep.textContent).toEqual("1");
        expect(newStep.textContent).toEqual("2");
        expect(element).toEqual(getEl());
        done();
      });
    }));

  it("fires event when step is done transitioning", (): Promise<void> =>
    new Promise((done) => {
      initialize();

      getByText(getBody(), "forward").click();

      getEl().addEventListener("steppp:complete", (e) => {
        const { oldStep, newStep, element } = e.detail;

        expect(oldStep.textContent).toEqual("1");
        expect(newStep.textContent).toEqual("2");
        expect(element).toEqual(getEl());
        done();
      });
    }));
});
