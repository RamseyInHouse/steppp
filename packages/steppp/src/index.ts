import { Options, StepMovementArgs, Frame, FrameDef, Instance } from "./types";
import {
  buildAnimation,
  getHeight,
  fireCustomEvent,
  afterRepaint,
  getDimensions,
} from "./utils";
import defaultOptions from "./defaultOptions";

function Steppp(element: HTMLElement, options: any = defaultOptions): Instance {
  options = { ...defaultOptions, ...options } as Options;

  const stepWrapper = (element.querySelector("[data-steppp-wrapper]") ||
    element) as HTMLElement;

  let stepNodes: NodeList | HTMLCollection;
  let steps: HTMLElement[];
  let currentWrapperHeight: number;

  const setSteps = () => {
    stepNodes = options.stepSelector
      ? stepWrapper.querySelectorAll(options.stepSelector)
      : stepWrapper.children;
    steps = Array.from(stepNodes) as HTMLElement[];

    currentWrapperHeight = getHeight(getStep());
  };

  const mergedOptions: Options = { ...defaultOptions, ...options };
  const { stepIsValid } = mergedOptions;

  const getStep = (stepIndex: number = getActiveStepIndex()): HTMLElement => {
    return steps[stepIndex];
  };

  const getStepByName = (stepName: string = "") => {
    return steps.find((step) => step.dataset.stepppName === stepName);
  };

  const getActiveStepIndex = (): number => {
    return (
      steps.findIndex((step) => step.dataset.stepppActive !== undefined) || 0
    );
  };

  const moveTo = (stepName: string) => moveStep({ stepName });

  const forward = () => moveStep();

  const backward = () => moveStep({ direction: "backward" });

  const animate = (args: any) => {
    args.timingOptions = options.timingOptions;
    return buildAnimation(args);
  };

  const queueAnimations = (oldStep: HTMLElement, newStep: HTMLElement) => {
    const { exit: exitFrames, enter: enterFrames } = animationFrames;
    const oldStepHeight = `${currentWrapperHeight}px`;
    const newStepHeight = `${calculateWrapperHeight(newStep)}px`;

    return [
      animate({
        frames: exitFrames,
        targetElement: oldStep,
      }),
      animate({
        frames: enterFrames,
        targetElement: newStep,
      }),
      animate({
        frames: [
          {
            height: oldStepHeight,
          },
          {
            height: newStepHeight,
          },
        ],
        targetElement: stepWrapper,
      }),
    ];
  };

  /**
   * While animating, we need to "freeze" the dimensions of each step, since they'll be
   * absolutely positioned and removed from the document flow. Then, we can reset.
   */
  const transitionDimensions = (oldStep: HTMLElement, newStep: HTMLElement) => {
    const { height: oldHeight, width: oldWidth } = getDimensions(oldStep);
    const { height: newHeight, width: newWidth } = getDimensions(newStep);
    const { exit: exitFrames, enter: enterFrames } = animationFrames;

    oldStep.style.width = `${oldWidth}px`;
    oldStep.style.height = `${oldHeight}px`;

    newStep.style.width = `${newWidth}px`;
    newStep.style.height = `${newHeight}px`;

    oldStep.style.position = "absolute";
    newStep.style.position = "absolute";

    // Set the initial state of the upcoming animation, so that
    // there's no flash of the old step. This must happen _before_
    // the next browser repaint.
    for (const [key, value] of Object.entries(exitFrames[0])) {
      oldStep.style[key as any] = value;
    }

    for (const [key, value] of Object.entries(enterFrames[0])) {
      newStep.style[key as any] = value;
    }

    return function resetDimensions() {
      const modifiedAttributes = ["width", "height", "position"];
      [oldStep, newStep].forEach((step) => {
        modifiedAttributes.forEach((attr) => {
          step.style[attr as any] = "";
        });
      });
    };
  };

  const moveStep = async ({
    stepName = "",
    direction = "forward",
  }: StepMovementArgs = {}): Promise<void> => {
    setSteps();

    if (currentAnimations.length) {
      currentAnimations.map((a) => a.finish());
    }

    return new Promise((resolve) => {
      afterRepaint(async () => {
        const fallbackIncrementor = direction === "forward" ? 1 : -1;
        const oldActiveStep = getStep();

        const newActiveStep =
          getStepByName(stepName) ||
          getStep(getActiveStepIndex() + fallbackIncrementor);

        const eventArgs = {
          oldStep: oldActiveStep,
          newStep: newActiveStep,
          element,
        };

        // We're at the end of the line. Don't bother with anything else.
        if (!newActiveStep) {
          fireCustomEvent({
            ...eventArgs,
            name: "steppp:abort",
          });

          return resolve();
        }

        newActiveStep.style.display = "block";

        const resetDimensions = transitionDimensions(
          oldActiveStep,
          newActiveStep
        );

        function resolveAndReset() {
          resetDimensions();

          return resolve();
        }

        if (direction === "forward" && !(await stepIsValid(getStep()))) {
          fireCustomEvent({
            ...eventArgs,
            name: "steppp:invalid",
          });

          return resolveAndReset();
        }

        fireCustomEvent({
          ...eventArgs,
          name: "steppp:start",
        });

        afterRepaint(async () => {
          currentAnimations = queueAnimations(oldActiveStep, newActiveStep);

          await Promise.all(currentAnimations.map((a) => a.finished));

          currentAnimations.forEach((a: Animation) => {
            a.commitStyles();
          });

          currentAnimations = [];

          // Most of the time, `oldActiveStep` is the only step we need to worry about,
          // but in some weird scenerios, multiple steps may hold onto a stale state.
          steps.forEach((s) => {
            delete s.dataset.stepppActive;
            heightObserver.unobserve(s);
            s.style.display = "none";
          });

          newActiveStep.style.display = "block";
          newActiveStep.dataset.stepppActive = "";
          heightObserver.observe(newActiveStep);

          fireCustomEvent({
            ...eventArgs,
            name: "steppp:complete",
          });

          return resolveAndReset();
        });
      });
    });
  };

  const calculateWrapperHeight = (
    step: HTMLElement,
    height?: number
  ): number => {
    element.style.height = "";
    const originalDisplay = step.style.display;
    step.style.display = "block";
    const newHeight = height || getHeight(step);
    step.style.display = originalDisplay;

    currentWrapperHeight = newHeight;

    return newHeight;
  };

  const computeAnimationFrames = (frames: Frame[] | FrameDef): FrameDef => {
    if (Array.isArray(frames)) {
      return {
        enter: frames,
        exit: [...frames.slice()].reverse(),
      };
    }

    return frames;
  };

  const heightObserver = new ResizeObserver((entries) => {
    const entry = entries[0];

    if (!entry) return;

    const oldHeight = currentWrapperHeight;
    const { height: newHeight } = entry.contentRect;

    calculateWrapperHeight(entry.target as HTMLElement, newHeight);

    animate({
      frames: [
        {
          height: `${oldHeight}px`,
        },
        {
          height: `${newHeight}px`,
        },
      ],
      targetElement: stepWrapper,
    });
  });

  setSteps();

  const animationFrames: FrameDef = computeAnimationFrames(options.frames);

  let currentAnimations: Animation[] = [];

  heightObserver.observe(getStep());

  return {
    backward,
    forward,
    moveTo,
  };
}

export default Steppp;
