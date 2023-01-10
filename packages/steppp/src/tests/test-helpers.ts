export const getEl = (selector = "#steppp"): HTMLElement =>
  document.querySelector(selector) as HTMLElement;
export const getBody = () => document.body as HTMLBodyElement;
