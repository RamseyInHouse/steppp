import { Options } from "./types";

const defaultOptions: Options = {
  stepIsValid: async (_step) => true,
  frames: [
    {
      transform: "translateX(-100%)",
    },
    {
      transform: "translateX(0)",
    },
  ],
};

export default defaultOptions;
