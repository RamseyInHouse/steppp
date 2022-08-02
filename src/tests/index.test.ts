import { getEl } from "./test-helpers";
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

it("Default animations are used.", (): Promise<void> =>
  new Promise((done) => {
    const buildAnimationSpy = vi
      .spyOn(utils, "buildAnimation")
      .mockImplementation(() => {
        return {
          finished: Promise.resolve({} as Animation),
          commitStyles() {},
          persist() {},
        } as Animation;
      });

    const { forward } = Steppp(getEl());

    forward();

    getEl().addEventListener("steppp:complete", () => {
      const frames = buildAnimationSpy.mock.calls[0][0].frames;

      expect(frames).toEqual(
        expect.arrayContaining([{ opacity: "0" }, { opacity: "1" }])
      );

      done();
    });
  }));

it("Custom animations are used.", (done) => {
  const buildAnimationSpy = vi
    .spyOn(utils, "buildAnimation")
    .mockImplementation(() => {
      return {
        finished: Promise.resolve({} as Animation),
        commitStyles() {},
        persist() {},
      } as Animation;
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
  const observeMock = vi.fn();
  const unobserveMock = vi.fn();

  global.ResizeObserver.prototype.observe = observeMock;
  global.ResizeObserver.prototype.unobserve = unobserveMock;

  Steppp(getEl());

  expect(observeMock).toHaveBeenCalledTimes(1);
  expect(observeMock).toHaveBeenCalledWith(getEl("[data-steppp-active]"));
  expect(unobserveMock).toHaveBeenCalledTimes(0);
});

// it("Handles custom enter/exit animations.", () => {
//     const buildAnimationSpy = vi.spyOn(utils, 'buildAnimation').mockImplementation(() => {
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
