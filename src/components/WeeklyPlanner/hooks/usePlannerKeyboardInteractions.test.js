import { afterEach, describe, expect, it, vi } from "vitest";
import useMoveSelection from "./useMoveSelection";
import { act, renderHook } from "@testing-library/react";
import usePlannerKeyboardInteractions from "./usePlannerKeyboardInteractions";

vi.mock("./useMoveSelection", () => {
  const handleMove = vi.fn();

  return {
    default: () => handleMove,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockEvent = {
  key: "ArrowUp",
  target: {
    closest: vi.fn(),
  },
  preventDefault: vi.fn(),
};

const mockCell = {
  dataset: {
    row: "0",
    column: "0",
  },
};

const mockItems = [{ id: "item-1" }];

describe("usePlannerKeyboardInteractions", () => {
  const mockHandleMove = vi.mocked(useMoveSelection());

  const testKeys = [
    { key: "ArrowUp", direction: "up" },
    { key: "ArrowLeft", direction: "left" },
    { key: "ArrowDown", direction: "down" },
    { key: "ArrowRight", direction: "right" },
  ];

  it("does not do anything when other keys are pressed", () => {
    const { result } = renderHook(() =>
      usePlannerKeyboardInteractions(mockItems)
    );

    act(() => {
      result.current({ ...mockEvent, key: "Space" });
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockHandleMove).not.toHaveBeenCalled();
  });

  it("does not do anything when the target is not a grid cell", () => {
    mockEvent.target.closest.mockReturnValue(undefined);

    const { result } = renderHook(() =>
      usePlannerKeyboardInteractions(mockItems)
    );

    act(() => {
      result.current(mockEvent);
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockHandleMove).not.toHaveBeenCalled();
  });

  it.each(testKeys)(
    "calls handleMove with correct arguments when $key is pressed",
    ({ key, direction }) => {
      mockEvent.target.closest.mockReturnValue(mockCell);

      const { result } = renderHook(() =>
        usePlannerKeyboardInteractions(mockItems)
      );

      act(() => {
        result.current({ ...mockEvent, key });
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockHandleMove).toHaveBeenCalledWith(0, 0, direction);
    }
  );
});
