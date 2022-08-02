import { Options } from "./types";

const defaultOptions: Options = {
  stepIsValid: async (_step) => true,
  frames: [{ opacity: "0" }, { opacity: "1" }],
};

export default defaultOptions;
