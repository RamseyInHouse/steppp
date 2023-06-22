import { BuildAnimationArgs } from "./types";

const defaults: KeyframeAnimationOptions = {
  easing: "ease",
  duration: 500,
  fill: "forwards",
};

export const buildAnimation = ({
  frames,
  targetElement,
  timingOptions = {},
}: BuildAnimationArgs): Animation => {
  return targetElement.animate(frames, {
    ...defaults,
    ...timingOptions,
  });
};

export const getDimensions = (element: HTMLElement): DOMRect => {
  return element.getBoundingClientRect();
};

export const getHeight = (element: HTMLElement): number => {
  return getDimensions(element).height;
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
