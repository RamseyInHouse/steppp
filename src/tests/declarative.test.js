import "@testing-library/jest-dom";
import { getByText } from "@testing-library/dom";
import { getEl, getBody } from "./test-helpers";
import Steppp from "../index";
import * as utils from "../utils";

beforeEach(() => {
  document.body.innerHTML = `
    <div id="steppp">
        <div data-steppp-wrapper>
            <section data-steppp-active>1</section>
            <section>2</section>
            <section data-steppp-name="number_three">3</section>
            <section>4</section>
            <section>5</section>
        </div>

        <button data-steppp-backward>
          backward
        </button>
    
        <button data-steppp-forward>
          forward
        </button>

        <button data-steppp-to="number_three">
            move to step #3
        </button>
    </div>
  `;

  Steppp(getEl());
});

it("moves forward.", (done) => {
  getByText(getBody(), "forward").click();

  getEl().addEventListener("steppp:complete", () => {
    expect(getByText(getBody(), "2")).toHaveAttribute("data-steppp-active", "");
    done();
  });
});

it("moves backward", (done) => {
  getByText(getEl(), "1").removeAttribute("data-steppp-active");
  getByText(getEl(), "4").setAttribute("data-steppp-active", "");

  getByText(getBody(), "backward").click();

  getEl().addEventListener("steppp:complete", () => {
    expect(getByText(getEl(), "3")).toHaveAttribute("data-steppp-active", "");
    done();
  });
});

it("moves to specific named step", (done) => {
  getByText(getBody(), "move to step #3").click();

  getEl().addEventListener("steppp:complete", () => {
    expect(getByText(getEl(), "3")).toHaveAttribute("data-steppp-active", "");
    done();
  });
});
