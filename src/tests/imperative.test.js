import "@testing-library/jest-dom";
import { getByText } from "@testing-library/dom";
import { getEl, getBody } from "./test-helpers";
import Steppp from "../index";
import * as utils from "../utils";

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

it("moves forward.", (done) => {
  initialize();

  getByText(getBody(), "forward").click();

  getEl().addEventListener("steppp:complete", () => {
    expect(getByText(getEl(), "2")).toHaveAttribute("data-steppp-active", "");
    done();
  });
});

it("moves backward.", (done) => {
  getByText(getEl(), "1").removeAttribute("data-steppp-active");
  getByText(getEl(), "4").setAttribute("data-steppp-active", "");

  initialize();

  getByText(getBody(), "backward").click();

  getEl().addEventListener("steppp:complete", () => {
    expect(getByText(getEl(), "3")).toHaveAttribute("data-steppp-active", "");
    done();
  });
});

it("moves to named step.", (done) => {
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
    expect(getByText(getEl(), "3")).toHaveAttribute("data-steppp-active", "");
    done();
  });
});

it("does not move forward when no steps are available", (done) => {
  getByText(getEl(), "1").removeAttribute("data-steppp-active");
  getByText(getEl(), "5").setAttribute("data-steppp-active", "");

  initialize();

  getByText(getBody(), "forward").click();

  getEl().addEventListener("steppp:abort", () => {
    expect(getByText(getEl(), "5")).toHaveAttribute("data-steppp-active", "");
    done();
  });
});

it("does not move backward when no steps are available", (done) => {
  initialize();

  getByText(getBody(), "backward").click();

  getEl().addEventListener("steppp:abort", () => {
    expect(getByText(getEl(), "1")).toHaveAttribute("data-steppp-active", "");
    done();
  });
});

describe("custom events", () => {
  it("fires event when step is starting to transition", (done) => {
    initialize();

    getByText(getBody(), "forward").click();

    getEl().addEventListener("steppp:start", (e) => {
      const { oldStep, newStep, element } = e.detail;

      expect(oldStep).toHaveTextContent("1");
      expect(newStep).toHaveTextContent("2");
      expect(element).toEqual(getEl());
      done();
    });
  });

  it("fires event when step is done transitioning", (done) => {
    initialize();

    getByText(getBody(), "forward").click();

    getEl().addEventListener("steppp:complete", (e) => {
      const { oldStep, newStep, element } = e.detail;

      expect(oldStep).toHaveTextContent("1");
      expect(newStep).toHaveTextContent("2");
      expect(element).toEqual(getEl());
      done();
    });
  });
});
