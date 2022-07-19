import "@testing-library/jest-dom";
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

    <button id="forward">
      forward
    </button>
  `;
});

it("Default animations are used.", (done) => {
  const buildAnimationSpy = jest
    .spyOn(utils, "buildAnimation")
    .mockImplementation(() => {
      return {
        finished: Promise.resolve(true),
        commitStyles() {},
        persist() {},
      };
    });

  const { forward } = Steppp(getEl());

  forward();

  getEl().addEventListener("steppp:complete", () => {
    const frames = buildAnimationSpy.mock.calls[0][0].frames;

    expect(frames).toEqual(
      expect.arrayContaining([
        { transform: "translateX(0)" },
        { transform: "translateX(-100%)" },
      ])
    );
    done();
  });
});

it("Custom animations are used.", (done) => {
  const buildAnimationSpy = jest
    .spyOn(utils, "buildAnimation")
    .mockImplementation(() => {
      return {
        finished: Promise.resolve(true),
        commitStyles() {},
        persist() {},
      };
    });

  const { forward } = Steppp(getEl(), {
    frames: [
      {
        opacity: 0,
      },
      {
        opacity: 1,
      },
    ],
  });

  forward();

  getEl().addEventListener("steppp:complete", () => {
    const frames = buildAnimationSpy.mock.calls[0][0].frames;
    expect(frames).toEqual(
      expect.arrayContaining([{ opacity: 0 }, { opacity: 1 }])
    );
    done();
  });
});

it("Sets up resize listeners for the active step.", () => {
  const observeMock = jest.fn();
  const unobserveMock = jest.fn();

  window.ResizeObserver = function () {
    return {
      observe: observeMock,
      unobserve: unobserveMock,
    };
  };

  Steppp(getEl());

  expect(observeMock).toHaveBeenCalledTimes(1);
  expect(observeMock).toHaveBeenCalledWith(getEl("[data-steppp-active]"));
  expect(unobserveMock).toHaveBeenCalledTimes(0);
});

// it("Handles custom enter/exit animations.", () => {
//     const buildAnimationSpy = jest.spyOn(utils, 'buildAnimation').mockImplementation(() => {
//         return {
//             finished: Promise.resolve(true),
//             commitStyles() {},
//             persist() {}
//         }
//     });

//     const { forward } = Steppp(getEl(), {
//         frames: [
//             {
//                 opacity: 0
//             },
//             {
//                 opacity: 1
//             }
//         ]
//     });

//     forward();

//     getEl().addEventListener('steppp:complete', () => {
//         const frames = buildAnimationSpy.mock.calls[0][0].frames;
//         expect(frames).toEqual(
//             expect.arrayContaining([ { opacity: 0 }, {  opacity: 1 } ])
//         )
//         done();
//     });
// });
