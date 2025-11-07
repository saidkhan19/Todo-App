import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { animate } from "motion/react";
import { useTimelineTrackContext } from "../context";
import useTimelineStore, {
  useActiveDatesSelector,
  useInteractionStateSelector,
  useIsInteractingSelector,
} from "../store";
import { mockStoreState } from "@/utils/test-utils";
import useTimelineCardInteractions from "./useTimelineCardInteractions";
import { mockProjectItem } from "@/mocks/items";
import { CELL_WIDTH, SCROLL_AREA_WIDTH } from "../consts";
import { useUpdateItem } from "@/hooks/queries";

vi.mock("motion/react", async () => ({
  animate: vi.fn(),
}));

vi.mock("../store", async () => ({
  default: vi.fn(),
  useActiveDatesSelector: vi.fn(),
  useInteractionStateSelector: vi.fn(),
  useIsInteractingSelector: vi.fn(),
}));

vi.mock("../context", async () => ({
  useTimelineTrackContext: vi.fn(),
}));

vi.mock("./useInteractionMouseState", async () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/queries", async () => {
  const mockUpdateFn = vi.fn();
  return {
    useUpdateItem: () => mockUpdateFn,
  };
});

const mockX = {
  get: vi.fn(),
};

const mockActions = {
  startInteraction: vi.fn(),
  stopInteraction: vi.fn(),
  updateStartDate: vi.fn(),
  updateEndDate: vi.fn(),
  updateDates: vi.fn(),
};

const mockNoInteractionState = {
  isInteracting: false,
  activeItem: null,
  interactionType: null,
  initialScrollX: null,
  interactionStartPosition: null,
  activeStartDate: null,
  activeEndDate: null,
};

const mockInteractionState = {
  isInteracting: true,
  activeItem: mockProjectItem,
  interactionType: "drag",
  initialScrollX: 0,
  interactionStartPosition: 0,
  activeStartDate: new Date("2025-05-01"),
  activeEndDate: new Date("2025-05-05"),
};

const mockEvent = {
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  clientX: 0,
};

const mockUseTimelineTrackContext = vi.mocked(useTimelineTrackContext);
const mockIsInteractingSelector = vi.mocked(useIsInteractingSelector);
const mockInteractionStateSelector = vi.mocked(useInteractionStateSelector);
const mockActiveDatesSelector = vi.mocked(useActiveDatesSelector);

const mockTrackState = (rect) => {
  if (rect) {
    mockUseTimelineTrackContext.mockReturnValue({
      x: mockX,
      containerRef: {
        current: {
          getBoundingClientRect: vi.fn().mockReturnValue(rect),
        },
      },
    });
  } else {
    mockUseTimelineTrackContext.mockReturnValue({
      x: mockX,
      containerRef: { current: null },
    });
  }
};

const mockStore = ({
  isInteracting,
  activeItem,
  interactionType,
  initialScrollX,
  interactionStartPosition,
  activeStartDate,
  activeEndDate,
  currentScroll = 0,
}) => {
  mockStoreState(useTimelineStore, { activeItem, ...mockActions });
  mockIsInteractingSelector.mockReturnValue(isInteracting);
  mockInteractionStateSelector.mockReturnValue({
    interactionType,
    initialScrollX,
    interactionStartPosition,
  });
  mockActiveDatesSelector.mockReturnValue({
    startDate: activeStartDate,
    endDate: activeEndDate,
  });
  mockX.get.mockReturnValue(currentScroll);
};

afterEach(() => {
  vi.resetAllMocks();
});

describe("useTimelineCardInteractions", () => {
  describe("handlePointerDownResizeLeft", () => {
    beforeEach(() => {
      mockTrackState();
    });

    it("correctly updates the store for 'resize-left' interaction", () => {
      mockStore({ ...mockNoInteractionState, currentScroll: 100 });
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockActions.startInteraction).not.toHaveBeenCalled();

      act(() => {
        result.current.handlePointerDownResizeLeft(mockEvent);
      });

      expect(mockActions.startInteraction).toHaveBeenCalledWith({
        activeItem: mockProjectItem,
        initialScrollX: 100,
        interactionType: "resize-left",
        interactionStartPosition: 0,
      });
    });

    it("does not update the store if another interaction is happening", () => {
      mockStore(mockInteractionState);
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockActions.startInteraction).not.toHaveBeenCalled();

      act(() => {
        result.current.handlePointerDownResizeLeft(mockEvent);
      });

      expect(mockActions.startInteraction).not.toHaveBeenCalled();
    });
  });

  describe("handlePointerDownResizeRight", () => {
    beforeEach(() => {
      mockTrackState();
    });

    it("correctly updates the store for 'resize-right' interaction", () => {
      mockStore({ ...mockNoInteractionState, currentScroll: 100 });
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockActions.startInteraction).not.toHaveBeenCalled();

      act(() => {
        result.current.handlePointerDownResizeRight(mockEvent);
      });

      expect(mockActions.startInteraction).toHaveBeenCalledWith({
        activeItem: mockProjectItem,
        initialScrollX: 100,
        interactionType: "resize-right",
        interactionStartPosition: 0,
      });
    });

    it("does not update the store if another interaction is happening", () => {
      mockStore({ ...mockInteractionState });
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockActions.startInteraction).not.toHaveBeenCalled();

      act(() => {
        result.current.handlePointerDownResizeRight(mockEvent);
      });

      expect(mockActions.startInteraction).not.toHaveBeenCalled();
    });
  });

  describe("handlePointerDownDrag", () => {
    beforeEach(() => {
      mockTrackState();
    });

    it("correctly updates the store for 'drag' interaction", () => {
      mockStore({ ...mockNoInteractionState, currentScroll: 100 });
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockActions.startInteraction).not.toHaveBeenCalled();

      act(() => {
        result.current.handlePointerDownDrag(mockEvent);
      });

      expect(mockActions.startInteraction).toHaveBeenCalledWith({
        activeItem: mockProjectItem,
        initialScrollX: 100,
        interactionType: "drag",
        interactionStartPosition: 0,
      });
    });

    it("does not update the store if another interaction is happening", () => {
      mockStore(mockInteractionState);
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockActions.startInteraction).not.toHaveBeenCalled();

      act(() => {
        result.current.handlePointerDownDrag(mockEvent);
      });

      expect(mockActions.startInteraction).not.toHaveBeenCalled();
    });
  });

  describe("handlePointerMove", () => {
    const mockAnimate = vi.mocked(animate);

    it("does not do anything when not interacting", () => {
      mockTrackState();
      mockStore(mockNoInteractionState);
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      act(() => {
        result.current.handlePointerMove(mockEvent);
      });

      expect(mockActions.startInteraction).not.toHaveBeenCalled();
      expect(mockActions.updateStartDate).not.toHaveBeenCalled();
      expect(mockActions.updateEndDate).not.toHaveBeenCalled();
      expect(mockActions.updateDates).not.toHaveBeenCalled();
      expect(mockActions.stopInteraction).not.toHaveBeenCalled();
      expect(mockAnimate).not.toHaveBeenCalled();
    });

    it("does not do anything when containerRef is not defined", () => {
      mockTrackState();
      mockStore(mockInteractionState);
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      act(() => {
        result.current.handlePointerMove(mockEvent);
      });

      expect(mockActions.startInteraction).not.toHaveBeenCalled();
      expect(mockActions.updateStartDate).not.toHaveBeenCalled();
      expect(mockActions.updateEndDate).not.toHaveBeenCalled();
      expect(mockActions.updateDates).not.toHaveBeenCalled();
      expect(mockActions.stopInteraction).not.toHaveBeenCalled();
      expect(mockAnimate).not.toHaveBeenCalled();
    });

    it("updates start date on 'resize-left' event", () => {
      mockTrackState({ left: 100, right: 600 });
      mockStore(mockNoInteractionState);
      const { result, rerender } = renderHook(() =>
        useTimelineCardInteractions({
          ...mockProjectItem,
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
        })
      );

      // Start interaction state internally
      act(() => {
        result.current.handlePointerDownResizeLeft(mockEvent);
      });
      mockStore({
        ...mockInteractionState,
        interactionType: "resize-left",
        interactionStartPosition: 200,
      });
      rerender();

      act(() => {
        result.current.handlePointerMove({
          ...mockEvent,
          clientX: 200 + CELL_WIDTH, // Move 1 cell right from initial position
        });
      });

      expect(mockActions.updateStartDate).toHaveBeenCalledWith(
        new Date("2025-05-02") // Updates to 2nd date
      );
    });

    it("does not update start date past the end date", () => {
      mockTrackState({ left: 100, right: 600 });
      mockStore(mockNoInteractionState);
      const { result, rerender } = renderHook(() =>
        useTimelineCardInteractions({
          ...mockProjectItem,
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
        })
      );

      // Start interaction state internally
      act(() => {
        result.current.handlePointerDownResizeLeft(mockEvent);
      });
      mockStore({
        ...mockInteractionState,
        interactionType: "resize-left",
        interactionStartPosition: 200,
      });
      rerender();

      act(() => {
        result.current.handlePointerMove({
          ...mockEvent,
          clientX: 200 + CELL_WIDTH * 10, // Move 10 cells right from initial position
        });
      });

      expect(mockActions.updateStartDate).toHaveBeenCalledWith(
        new Date("2025-05-03") // Does not go beyond the end date
      );
    });

    it("updates end date on 'resize-right' event", () => {
      mockTrackState({ left: 100, right: 600 });
      mockStore(mockNoInteractionState);
      const { result, rerender } = renderHook(() =>
        useTimelineCardInteractions({
          ...mockProjectItem,
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
        })
      );

      // Start interaction state internally
      act(() => {
        result.current.handlePointerDownResizeRight(mockEvent);
      });
      mockStore({
        ...mockInteractionState,
        interactionType: "resize-right",
        interactionStartPosition: 200,
      });
      rerender();

      act(() => {
        result.current.handlePointerMove({
          ...mockEvent,
          clientX: 200 + CELL_WIDTH, // Move 1 cell right from initial position
        });
      });

      expect(mockActions.updateEndDate).toHaveBeenCalledWith(
        new Date("2025-05-04") // Updates to 2nd date
      );
    });

    it("does not update end date past the start date", () => {
      mockTrackState({ left: 100, right: 600 });
      mockStore(mockNoInteractionState);
      const { result, rerender } = renderHook(() =>
        useTimelineCardInteractions({
          ...mockProjectItem,
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
        })
      );

      // Start interaction state internally
      act(() => {
        result.current.handlePointerDownResizeRight(mockEvent);
      });
      mockStore({
        ...mockInteractionState,
        interactionType: "resize-right",
        interactionStartPosition: 500,
      });
      rerender();

      act(() => {
        result.current.handlePointerMove({
          ...mockEvent,
          clientX: 500 - CELL_WIDTH * 10, // Move 10 cells left from initial position
        });
      });

      expect(mockActions.updateEndDate).toHaveBeenCalledWith(
        new Date("2025-05-01") // Does not go beyond the start date
      );
    });

    it("updates both dates on 'drag' event", () => {
      mockTrackState({ left: 100, right: 600 });
      mockStore(mockNoInteractionState);
      const { result, rerender } = renderHook(() =>
        useTimelineCardInteractions({
          ...mockProjectItem,
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
        })
      );

      // Start interaction state internally
      act(() => {
        result.current.handlePointerDownDrag(mockEvent);
      });
      mockStore({
        ...mockInteractionState,
        interactionType: "drag",
        interactionStartPosition: 200,
      });
      rerender();

      act(() => {
        result.current.handlePointerMove({
          ...mockEvent,
          clientX: 200 + CELL_WIDTH, // Move 1 cell right from initial position
        });
      });

      expect(mockActions.updateDates).toHaveBeenCalledWith(
        new Date("2025-05-02"), // Updates start date
        new Date("2025-05-04") // Updates end date
      );
    });

    it("triggers scroll left animation when mouse is in the left scroll area", () => {
      mockTrackState({ left: 100, right: 600 });
      mockStore(mockNoInteractionState);
      const { result, rerender } = renderHook(() =>
        useTimelineCardInteractions({
          ...mockProjectItem,
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
        })
      );

      // Start interaction state internally
      act(() => {
        result.current.handlePointerDownDrag(mockEvent);
      });
      mockStore({
        ...mockInteractionState,
        interactionType: "drag",
        interactionStartPosition: 200,
      });
      rerender();

      act(() => {
        result.current.handlePointerMove({
          ...mockEvent,
          clientX: 100 + SCROLL_AREA_WIDTH - 1, // Move event within the left scroll area
        });
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        mockX,
        CELL_WIDTH, // Triggers scroll left one cell
        expect.any(Object)
      );
    });

    it("triggers scroll right animation when mouse is in the right scroll area", () => {
      mockTrackState({ left: 100, right: 600 });
      mockStore(mockNoInteractionState);
      const { result, rerender } = renderHook(() =>
        useTimelineCardInteractions({
          ...mockProjectItem,
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
        })
      );

      // Start interaction state internally
      act(() => {
        result.current.handlePointerDownDrag(mockEvent);
      });
      mockStore({
        ...mockInteractionState,
        interactionType: "drag",
        interactionStartPosition: 200,
      });
      rerender();

      act(() => {
        result.current.handlePointerMove({
          ...mockEvent,
          clientX: 600 - SCROLL_AREA_WIDTH + 1, // Move event within the right scroll area
        });
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        mockX,
        -CELL_WIDTH, // Triggers scroll right one cell
        expect.any(Object)
      );
    });
  });

  describe("handlePointerUp", () => {
    beforeEach(() => {
      mockTrackState();
    });

    const mockUpdateItem = vi.mocked(useUpdateItem());

    it("calls stopInteraction action", async () => {
      mockStore(mockInteractionState);
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockActions.stopInteraction).not.toHaveBeenCalled();

      await act(async () => {
        result.current.handlePointerUp(mockEvent);
      });

      expect(mockActions.stopInteraction).toHaveBeenCalled();
    });

    it("sends correct updates", () => {
      mockStore(mockInteractionState);
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockUpdateItem).not.toHaveBeenCalled();

      act(() => {
        result.current.handlePointerUp(mockEvent);
      });

      expect(mockUpdateItem).toHaveBeenCalled();
      expect(mockUpdateItem).toHaveBeenCalledWith(mockProjectItem.id, {
        startDate: mockInteractionState.activeStartDate,
        endDate: mockInteractionState.activeEndDate,
      });
    });

    it("does not send updates if updates are the same", () => {
      mockStore({
        ...mockInteractionState,
        activeStartDate: mockProjectItem.startDate,
        activeEndDate: mockProjectItem.endDate,
      });
      const { result } = renderHook(() =>
        useTimelineCardInteractions(mockProjectItem)
      );

      expect(mockUpdateItem).not.toHaveBeenCalled();

      act(() => {
        result.current.handlePointerUp(mockEvent);
      });

      expect(mockUpdateItem).not.toHaveBeenCalled();
    });
  });
});
