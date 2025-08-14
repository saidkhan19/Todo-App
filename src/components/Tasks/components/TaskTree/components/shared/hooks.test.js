import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useModalState } from "./hooks";

describe("useModalState", () => {
  it("renders with default value of 'false'", () => {
    const { result } = renderHook(() => useModalState());

    expect(result.current.isOpen).toBe(false);
  });

  it("changes isOpen state when open & close are called", () => {
    const { result } = renderHook(() => useModalState());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });
});
