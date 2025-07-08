import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Grid from "./Grid";
import useDateRangeSelection from "../hooks/useDateRangeSelection";
import useCalendarInteraction from "../hooks/useCalendarInteraction";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  const currentView = new Date("2025-01-01");

  return {
    ...mod,
    useContext: vi.fn(() => ({
      currentView,
    })),
  };
});

vi.mock("../hooks/useCalendarInteraction", () => {
  const handleDateClick = vi.fn();
  const handleKeyDown = vi.fn();

  return {
    default: vi.fn(() => ({
      handleDateClick,
      handleKeyDown,
    })),
  };
});

vi.mock("../hooks/useDateRangeSelection", () => {
  const handlePointerDown = vi.fn();
  const handlePointerMove = vi.fn();
  const handlePointerUp = vi.fn();

  return {
    default: vi.fn(() => ({
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
    })),
  };
});

vi.mock("../utils", () => ({
  generateCalendarDays: vi.fn().mockReturnValue(["123", "456", "789"]),
}));

vi.mock("./WeekRow", () => ({
  default: ({ days }) => <div data-testid={days} tabIndex="0" />,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("Calendar Grid", () => {
  const { handleDateClick, handleKeyDown } = useCalendarInteraction();
  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDateRangeSelection();

  it("renders WeekRow with items from generateCalendarDays", () => {
    render(<Grid />);

    for (const item of ["123", "456", "789"]) {
      expect(screen.queryByTestId(item)).toBeInTheDocument();
    }
  });

  it("registers calendar interaction handlers", async () => {
    const user = userEvent.setup();

    render(<Grid />);

    // Click handler
    expect(handleDateClick).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("123"));

    expect(handleDateClick).toHaveBeenCalled();

    // Keyboard handler
    expect(handleKeyDown).not.toHaveBeenCalled();

    screen.getByTestId("123").focus();
    await user.keyboard("{Enter}");

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it("registers pointer events", async () => {
    const user = userEvent.setup();

    render(<Grid />);

    // PointerDown handler
    expect(handlePointerDown).not.toHaveBeenCalled();

    await user.pointer({
      keys: "[MouseLeft>]",
      target: screen.getByTestId("123"),
    });

    expect(handlePointerDown).toHaveBeenCalled();

    // PointerMove handler
    expect(handlePointerMove).not.toHaveBeenCalled();

    await user.pointer({
      target: screen.getByTestId("456"),
    });

    expect(handlePointerMove).toHaveBeenCalled();

    // PointerUp handler
    expect(handlePointerUp).not.toHaveBeenCalled();

    await user.pointer("[/MouseLeft]");

    expect(handlePointerUp).toHaveBeenCalled();
  });

  it("defines and passes containerRef to useDateRangeSelection", async () => {
    render(<Grid />);

    expect(useDateRangeSelection).toHaveBeenCalledWith(
      expect.objectContaining({ containerRef: expect.any(Object) })
    );
  });
});
