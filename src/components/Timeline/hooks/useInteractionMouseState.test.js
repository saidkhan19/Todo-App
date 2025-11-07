import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import useInteractionMouseState from "./useInteractionMouseState";
import { resetCursor, setCursor } from "@/utils/document";

vi.mock("@/utils/document", async () => ({
  setCursor: vi.fn(),
  resetCursor: vi.fn(),
}));

const mockSetCursor = vi.mocked(setCursor);
const mockResetCursor = vi.mocked(resetCursor);

afterEach(() => {
  vi.clearAllMocks();
});

describe("useInteractionMouseState", () => {
  it("does not update mouse if interactionState is not valid", () => {
    renderHook(() => useInteractionMouseState(null));

    expect(mockSetCursor).not.toHaveBeenCalled();
    expect(mockResetCursor).not.toHaveBeenCalled();
  });

  it("handles resize-right state", () => {
    renderHook(() => useInteractionMouseState("resize-right"));

    expect(mockSetCursor).toHaveBeenCalledWith("w-resize");
  });

  it("handles resize-left state", () => {
    renderHook(() => useInteractionMouseState("resize-left"));

    expect(mockSetCursor).toHaveBeenCalledWith("e-resize");
  });

  it("handles drag state", () => {
    renderHook(() => useInteractionMouseState("drag"));

    expect(mockSetCursor).toHaveBeenCalledWith("grabbing");
  });

  it("resets cursor on unmount", () => {
    const { unmount } = renderHook(() => useInteractionMouseState("drag"));

    unmount();

    expect(mockResetCursor).toHaveBeenCalled();
  });
});
