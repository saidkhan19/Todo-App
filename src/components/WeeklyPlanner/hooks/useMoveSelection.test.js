import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { mockStoreState } from "@/utils/test-utils";
import { useBatchUpdateItems } from "@/hooks/queries";
import { grid } from "../models/grid";
import { usePlannerStore } from "../store";
import Week from "../../../models/week";
import useMoveSelection from "./useMoveSelection";

vi.mock("../store", () => ({
  usePlannerStore: vi.fn(),
}));

vi.mock("@/hooks/queries", () => {
  const mockBatchUpdate = vi.fn();

  return {
    useBatchUpdateItems: () => mockBatchUpdate,
  };
});

vi.mock("../models/grid", () => ({
  grid: {
    getMoveItemUpdates: vi.fn(),
  },
}));

afterEach(() => {
  vi.resetAllMocks();
});

const mockDefaultState = {
  currentWeek: new Week(new Date("01-01-2025")),
  setWeek: vi.fn(),
};

const mockItems = [{ id: "item-1" }, { id: "item-2" }];

const mockDefaultArgs = [0, 0, "up"];

describe("useMoveSelection", () => {
  const mockBatchUpdate = vi.mocked(useBatchUpdateItems());
  const mockGetMoveItemUpdates = vi.mocked(grid.getMoveItemUpdates);

  const mockSetWeek = vi.mocked(mockDefaultState.setWeek);

  it("does not do anything when there are no changes", () => {
    mockStoreState(usePlannerStore, mockDefaultState);
    mockGetMoveItemUpdates.mockReturnValue(undefined);

    const { result } = renderHook(() => useMoveSelection(mockItems));

    act(() => {
      result.current(...mockDefaultArgs);
    });

    expect(mockBatchUpdate).not.toHaveBeenCalled();
    expect(mockSetWeek).not.toHaveBeenCalled();
  });

  it("sends updates when there are updates", () => {
    mockStoreState(usePlannerStore, mockDefaultState);
    mockGetMoveItemUpdates.mockReturnValue({ updates: [] });

    const { result } = renderHook(() => useMoveSelection(mockItems));

    act(() => {
      result.current(...mockDefaultArgs);
    });

    expect(mockBatchUpdate).toHaveBeenCalled();
    expect(mockSetWeek).not.toHaveBeenCalled();
  });

  it("updates the week when it has changed", () => {
    mockStoreState(usePlannerStore, mockDefaultState);
    mockGetMoveItemUpdates.mockReturnValue({ targetWeek: new Week() });

    const { result } = renderHook(() => useMoveSelection(mockItems));

    act(() => {
      result.current(...mockDefaultArgs);
    });

    expect(mockBatchUpdate).not.toHaveBeenCalled();
    expect(mockSetWeek).toHaveBeenCalled();
  });
});
