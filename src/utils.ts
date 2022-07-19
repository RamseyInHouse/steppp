import { BuildAnimationArgs, CommittableAnimation, Direction } from "./types";

const defaults: KeyframeAnimationOptions = {
  easing: "ease",
  duration: 500,
  fill: "forwards",
};

export const buildAnimation = ({
  frames,
  targetElement,
  timingOptions = {},
}: BuildAnimationArgs) => {
  return targetElement.animate(frames, {
    ...defaults,
    ...timingOptions,
  }) as CommittableAnimation;
};

export const getHeight = (element: HTMLElement): number => {
  return element.getBoundingClientRect().height;
};

export const fireCustomEvent = ({
  oldStep,
  newStep,
  element,
  name,
}: {
  oldStep: HTMLElement;
  newStep: HTMLElement;
  element: HTMLElement;
  name: string;
}): void => {
  const event = new CustomEvent(name, {
    detail: {
      oldStep,
      newStep,
      element,
    },
  });

  element.dispatchEvent(event);
};

export const afterRepaint = (cb: () => any): void => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cb();
    });
  });
};

export const isMovingBackward = (direction: Direction): boolean => {
  return direction === "backward";
};

export const flip = (items: any[]): any[] => {
  return [...items].reverse();
};
