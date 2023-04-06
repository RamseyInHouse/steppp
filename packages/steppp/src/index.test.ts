import { it, expect, vi, beforeEach } from "vitest";
import Steppp from ".";

beforeEach(() => {
  const mutationObserverMock = vi
    .fn<any, [MutationCallback]>()
    // @ts-ignore
    .mockImplementation(() => {
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        takeRecords: vi.fn(),
      };
    });

  // @ts-ignore
  global.MutationObserver = mutationObserverMock;
});

it("registers MutationObserver()", () => {
  Steppp(document.createElement("div"));

  expect(MutationObserver).toHaveBeenCalled();
});
