import { getByText } from "@testing-library/dom";
import { getEl, getBody } from "./test-helpers";
import Steppp from "../index";
import { beforeEach, it, expect } from "vitest";

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

it("moves forward.", () => {
  getByText(getBody(), "forward").click();

  new Promise<void>((resolve) => {
    getEl().addEventListener("steppp:complete", () => {
      expect(getByText(getBody(), "2").dataset.stepppActive).toEqual("");
      resolve();
    });
  });
});

it("moves backward", () => {
  getByText(getEl(), "1").removeAttribute("data-steppp-active");
  getByText(getEl(), "4").setAttribute("data-steppp-active", "");

  getByText(getBody(), "backward").click();

  return new Promise<void>((resolve) => {
    getEl().addEventListener("steppp:complete", () => {
      expect(getByText(getEl(), "3").dataset.stepppActive).toEqual("");
      resolve();
    });
  });
});

it("moves to specific named step", () => {
  getByText(getBody(), "move to step #3").click();

  return new Promise<void>((resolve) => {
    getEl().addEventListener("steppp:complete", () => {
      expect(getByText(getEl(), "3").dataset.stepppActive).toEqual("");
      resolve();
    });
  });
});
