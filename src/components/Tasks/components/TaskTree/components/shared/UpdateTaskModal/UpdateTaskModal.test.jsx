import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import UpdateTaskModal from "./UpdateTaskModal";
import { mockItem } from "@/mocks/items";
import { useUpdateItem } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => {
  const mockUpdateItem = vi.fn();

  return {
    useUpdateItem: () => mockUpdateItem,
  };
});

const mockFormData = {
  startDate: "start-date",
  endDate: "end-date",
  text: "text",
};

const mockModalState = {
  isOpen: false,
  open: vi.fn(),
  close: vi.fn(),
};

vi.mock("../ItemForm/ItemForm", () => ({
  default: ({
    isOpen,
    onCancel,
    onSave,
    defaultText,
    defaultStartDate,
    defaultEndDate,
  }) => (
    <div
      data-testid="item-form"
      data-is-open={isOpen}
      data-text={defaultText}
      data-start-date={defaultStartDate.toISOString()}
      data-end-date={defaultEndDate.toISOString()}
    >
      <button data-testid="cancel" type="button" onClick={onCancel} />
      <button
        data-testid="save"
        type="button"
        onClick={() => onSave(mockFormData)}
      />
    </div>
  ),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("UpdateTaskModal", () => {
  const mockUpdateItem = vi.mocked(useUpdateItem());

  it("does not render the form when isOpen is false", () => {
    render(<UpdateTaskModal modalState={mockModalState} item={mockItem} />);

    expect(screen.queryByTestId("item-form")).not.toBeInTheDocument();
  });

  it("renders the form with correct default values", () => {
    render(
      <UpdateTaskModal
        modalState={{ ...mockModalState, isOpen: true }}
        item={mockItem}
      />
    );

    const form = screen.getByTestId("item-form");

    expect(form).toBeInTheDocument();
    expect(form.dataset.isOpen).toBe("true");
    expect(form.dataset.text).toBe(mockItem.text);
    expect(form.dataset.startDate).toBe(mockItem.startDate.toISOString());
    expect(form.dataset.endDate).toBe(mockItem.endDate.toISOString());
  });

  it("calls 'close' when 'cancel' button is clicked", () => {
    render(
      <UpdateTaskModal
        modalState={{ ...mockModalState, isOpen: true }}
        item={mockItem}
      />
    );

    expect(mockModalState.close).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("cancel"));
    expect(mockModalState.close).toHaveBeenCalled();
  });

  it("passes correct data to 'updateItem' when form is submitted", () => {
    render(
      <UpdateTaskModal
        modalState={{ ...mockModalState, isOpen: true }}
        item={mockItem}
      />
    );

    expect(mockUpdateItem).not.toHaveBeenCalled();
    expect(mockModalState.close).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("save"));

    expect(mockModalState.close).toHaveBeenCalled();
    expect(mockUpdateItem).toHaveBeenCalledWith(
      mockItem.id,
      expect.objectContaining({
        text: "text",
        startDate: "start-date",
        endDate: "end-date",
      })
    );
  });
});
