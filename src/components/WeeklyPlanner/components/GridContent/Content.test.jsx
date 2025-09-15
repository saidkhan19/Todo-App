import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockStoreState } from "@/utils/test-utils";
import { useGetMaxRowCountSelector, usePlannerStore } from "../../store";
import Content from "./Content";
import useDragPointerHandlers from "../../hooks/useDragPointerHandlers";
import usePlannerKeyboardInteractions from "../../hooks/usePlannerKeyboardInteractions";

vi.mock("../../store", () => ({
  usePlannerStore: vi.fn(),
  useGetMaxRowCountSelector: vi.fn(),
}));

vi.mock("../../hooks/useDragPointerHandlers", () => {
  const mockHandlePointerMove = vi.fn();

  return {
    default: vi.fn(() => mockHandlePointerMove),
  };
});

vi.mock("../../hooks/usePlannerKeyboardInteractions", () => {
  const mockHandleKeyboard = vi.fn();

  return {
    default: vi.fn(() => mockHandleKeyboard),
  };
});

vi.mock("../GridRow/GridRow", () => ({
  default: ({ row, ariaRowIndex }) => (
    <div
      tabIndex={0}
      data-testid="grid-row"
      data-row={row}
      data-aria-row-index={ariaRowIndex}
    />
  ),
}));

vi.mock("@/components/UI/StatusMessage", () => ({
  default: ({ title, type, message }) => (
    <div
      data-testid="status-message"
      data-title={title}
      data-type={type}
      data-message={message}
    />
  ),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("GridConent > Content", () => {
  const mockUseGetMaxRowCount = vi.mocked(useGetMaxRowCountSelector);
  const mockUseDragPointerHandlers = vi.mocked(useDragPointerHandlers);
  const mockUsePlannerKeyboardInteractions = vi.mocked(
    usePlannerKeyboardInteractions
  );

  const mockHandlePointerMove = vi.mocked(useDragPointerHandlers());
  const mockHandleKeyboard = vi.mocked(usePlannerKeyboardInteractions());

  it("renders status row when rowCount is 0", () => {
    mockStoreState(usePlannerStore, { isDragging: false });
    mockUseGetMaxRowCount.mockReturnValue(0);

    render(<Content items={[]} />);

    expect(
      within(screen.queryByRole("rowgroup")).queryAllByRole("row")
    ).toHaveLength(1);

    const statusMessage = screen.getByTestId("status-message");
    expect(statusMessage).toBeInTheDocument();

    expect(statusMessage.dataset.type).toBe("info");
    expect(statusMessage.dataset.message).toBe(
      "Задач на эту неделю не найдено."
    );
  });

  it("renders rows equal to maxRowCount when not dragging", () => {
    mockStoreState(usePlannerStore, { isDragging: false });
    mockUseGetMaxRowCount.mockReturnValue(10);

    render(<Content items={[]} />);

    const rowgroup = screen.queryByRole("rowgroup");

    expect(rowgroup).toBeInTheDocument();
    expect(within(rowgroup).queryAllByTestId("grid-row")).toHaveLength(10);
  });

  it("renders rows equal to maxRowCount + 1 when dragging", () => {
    mockStoreState(usePlannerStore, { isDragging: true });
    mockUseGetMaxRowCount.mockReturnValue(10);

    render(<Content items={[]} />);

    const rowgroup = screen.queryByRole("rowgroup");

    expect(rowgroup).toBeInTheDocument();
    expect(within(rowgroup).queryAllByTestId("grid-row")).toHaveLength(11);
  });

  it("passes correct props to each GridRow", () => {
    mockStoreState(usePlannerStore, { isDragging: false });
    mockUseGetMaxRowCount.mockReturnValue(3);

    render(<Content items={[]} />);

    screen.getAllByTestId("grid-row").forEach((row, index) => {
      expect(row.dataset.row).toBe(String(index));
      expect(row.dataset.ariaRowIndex).toBe(String(index + 2));
    });
  });

  it("adds pointermove event listener to the document when dragging starts", async () => {
    const user = userEvent.setup();

    // Initally dragging is false
    mockStoreState(usePlannerStore, { isDragging: false });
    mockUseGetMaxRowCount.mockReturnValue(1);

    const { rerender } = render(<Content items={[]} />);

    // Trigger pointermove event
    await user.pointer([
      { target: document.body, coords: { clientX: 50, clientY: 50 } },
      { target: document.body, coords: { clientX: 150, clientY: 150 } },
    ]);

    expect(mockHandlePointerMove).not.toHaveBeenCalled();

    // Change dragging to true
    mockStoreState(usePlannerStore, { isDragging: true });
    rerender(<Content items={[]} />);

    // Trigger pointermove event
    await user.pointer([
      { target: document.body, coords: { clientX: 50, clientY: 50 } },
      { target: document.body, coords: { clientX: 150, clientY: 150 } },
    ]);

    expect(mockHandlePointerMove).toHaveBeenCalled();
  });

  it("removes pointermove event listener from the document when dragging ends", async () => {
    const user = userEvent.setup();

    // Initally dragging is true
    mockStoreState(usePlannerStore, { isDragging: true });
    mockUseGetMaxRowCount.mockReturnValue(1);

    const { rerender } = render(<Content items={[]} />);

    // Trigger pointermove event
    await user.pointer([
      { target: document.body, coords: { clientX: 50, clientY: 50 } },
      { target: document.body, coords: { clientX: 150, clientY: 150 } },
    ]);

    expect(mockHandlePointerMove).toHaveBeenCalled();

    // Change dragging to false
    mockStoreState(usePlannerStore, { isDragging: false });

    // Reset history
    mockHandlePointerMove.mockClear();
    rerender(<Content items={[]} />);

    // Trigger pointermove event
    await user.pointer([
      { target: document.body, coords: { clientX: 50, clientY: 50 } },
      { target: document.body, coords: { clientX: 150, clientY: 150 } },
    ]);

    expect(mockHandlePointerMove).not.toHaveBeenCalled();
  });

  it("removes pointermove event listener on component unmount", async () => {
    const user = userEvent.setup();

    // Initally dragging is true
    mockStoreState(usePlannerStore, { isDragging: true });
    mockUseGetMaxRowCount.mockReturnValue(1);

    const { unmount } = render(<Content items={[]} />);

    // Trigger pointermove event
    await user.pointer([
      { target: document.body, coords: { clientX: 50, clientY: 50 } },
      { target: document.body, coords: { clientX: 150, clientY: 150 } },
    ]);

    expect(mockHandlePointerMove).toHaveBeenCalled();

    // Clear history
    mockHandlePointerMove.mockClear();
    // Unmount the component
    unmount();

    // Trigger pointermove event
    await user.pointer([
      { target: document.body, coords: { clientX: 50, clientY: 50 } },
      { target: document.body, coords: { clientX: 150, clientY: 150 } },
    ]);

    expect(mockHandlePointerMove).not.toHaveBeenCalled();
  });

  it("handles keydown events when not dragging", async () => {
    const user = userEvent.setup();

    mockStoreState(usePlannerStore, { isDragging: false });
    mockUseGetMaxRowCount.mockReturnValue(1);

    render(<Content items={[]} />);

    screen.getByTestId("grid-row").focus();
    await user.keyboard("{ArrowUp}");

    expect(mockHandleKeyboard).toHaveBeenCalled();
  });

  it("disables keydown events when dragging", async () => {
    const user = userEvent.setup();

    mockStoreState(usePlannerStore, { isDragging: true });
    mockUseGetMaxRowCount.mockReturnValue(0);

    render(<Content items={[]} />);

    screen.getByTestId("grid-row").focus();
    await user.keyboard("{ArrowUp}");

    expect(mockHandleKeyboard).not.toHaveBeenCalled();
  });

  it("passes items array to useGetMaxRowCountSelector", () => {
    mockStoreState(usePlannerStore, { isDragging: false });
    mockUseGetMaxRowCount.mockReturnValue(1);

    const mockItems = [];
    render(<Content items={mockItems} />);

    expect(mockUseGetMaxRowCount).toHaveBeenCalledWith(mockItems);
  });

  it("passes correct arguments to useDragPointerHandlers", () => {
    mockStoreState(usePlannerStore, { isDragging: false });
    mockUseGetMaxRowCount.mockReturnValue(1);

    render(<Content items={[]} />);

    expect(mockUseDragPointerHandlers).toHaveBeenCalledWith(
      expect.objectContaining({
        gridContentRef: expect.any(Object),
        isDragging: false,
        rowCount: 1,
      })
    );
  });

  it("passes items array to usePlannerKeyboardInteractions", () => {
    mockStoreState(usePlannerStore, { isDragging: false });
    mockUseGetMaxRowCount.mockReturnValue(1);

    const mockItems = [];
    render(<Content items={mockItems} />);

    expect(mockUsePlannerKeyboardInteractions).toHaveBeenCalledWith(mockItems);
  });
});
