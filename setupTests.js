import { beforeEach, afterEach } from "vitest";

beforeEach(() => {
  Element.prototype.animate = (_frames, _options) => {
    return {
      commitStyles: () => {},
      persist: () => {},
      finished: Promise.resolve(true),
    };
  };

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.ResizeObserver = ResizeObserver;
});

afterEach(() => {
  document.body.innerHTML = "";
});
