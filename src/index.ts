import { Options, StepMovementArgs, Frame, FrameDef, Direction } from "./types";
import {
  buildAnimation,
  getHeight,
  fireCustomEvent,
  afterRepaint,
  isMovingBackward,
  flip,
} from "./utils";
import defaultOptions from "./defaultOptions";

function Steppp(element: HTMLElement, options: any = defaultOptions) {
  options = { ...defaultOptions, ...options } as Options;

  const stepWrapper = (element.querySelector("[data-steppp-wrapper]") ||
    element) as HTMLElement;
  const stepNodes: NodeList | HTMLCollection = options.stepSelector
    ? stepWrapper.querySelectorAll(options.stepSelector)
    : stepWrapper.children;
  const steps = Array.from(stepNodes) as HTMLElement[];

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

  const queueAnimations = (
    oldStep: HTMLElement,
    newStep: HTMLElement,
    direction: Direction
  ) => {
    const backward = isMovingBackward(direction);
    const { enter, exit } = animationFrames;
    const oldStepHeight = `${currentWrapperHeight}px`;
    const newStepHeight = `${calculateWrapperHeight(newStep)}px`;

    return [
      animate({
        frames: backward ? flip(exit) : exit,
        targetElement: backward ? newStep : oldStep,
      }),
      animate({
        frames: backward ? flip(enter) : enter,
        targetElement: backward ? oldStep : newStep,
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

  const moveStep = async ({
    stepName = "",
    direction = "forward",
  }: StepMovementArgs = {}): Promise<void> => {
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

        if (direction === "forward" && !(await stepIsValid(getStep()))) {
          fireCustomEvent({
            ...eventArgs,
            name: "steppp:invalid",
          });

          return resolve();
        }

        if (!newActiveStep) {
          fireCustomEvent({
            ...eventArgs,
            name: "steppp:abort",
          });

          return resolve();
        }

        fireCustomEvent({
          ...eventArgs,
          name: "steppp:start",
        });

        afterRepaint(async () => {
          currentAnimations = queueAnimations(
            oldActiveStep,
            newActiveStep,
            direction
          );

          await Promise.all(currentAnimations.map((a) => a.finished));

          currentAnimations.forEach((a: Animation) => {
            a.commitStyles();
            a.persist();
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

          return resolve();
        });
      });
    });
  };

  const calculateWrapperHeight = (
    step: HTMLElement,
    height?: number
  ): number => {
    element.style.height = "";
    step.style.display = "block";
    const newHeight = height || getHeight(step);

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

  const animationFrames: FrameDef = computeAnimationFrames(options.frames);

  let currentAnimations: Animation[] = [];

  getStep().style.position = "absolute";
  const currentStepHeight = getHeight(getStep());
  stepWrapper.style.height = `${currentStepHeight}px`;

  let currentWrapperHeight = currentStepHeight;

  heightObserver.observe(getStep());

  element.querySelectorAll("[data-steppp-backward]").forEach((el) => {
    el.addEventListener("click", backward);
  });

  element.querySelectorAll("[data-steppp-forward]").forEach((el) => {
    el.addEventListener("click", forward);
  });

  element.querySelectorAll("[data-steppp-to]").forEach((el) => {
    el.addEventListener("click", () => {
      moveTo((el as HTMLElement).dataset.stepppTo || "");
    });
  });

  return {
    backward,
    forward,
    moveTo,
  };
}

Steppp.stepIsValid = (_slide: HTMLElement): boolean => true;

export default Steppp;
