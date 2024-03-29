export type BuildAnimationArgs = {
  frames: any[];
  targetElement: HTMLElement;
  timingOptions: KeyframeAnimationOptions;
};
export type Frame = {
  [key: string]: any;
};
export type FrameDef = {
  enter: Frame[];
  exit: Frame[];
};
export type Direction = `forward` | `backward`;
export type Options = {
  stepIsValid: (step: HTMLElement) => Promise<boolean>;
  frames: Frame[] | FrameDef;
  stepSelector?: string;
};
export type Instance = {
  moveTo: (stepName: string) => Promise<void>;
  forward: () => Promise<void>;
  backward: () => Promise<void>;
};

export type StepMovementArgs = { stepName?: string; direction?: Direction };
