import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import useNotificationStore from "@/store/useNotificationStore";
import { saveItem } from "@/utils/firebase";
import AddSubtaskModal from "./AddSubtaskModal";
import { mockItem } from "@/mocks/items";

vi.mock("@/utils/firebase", async () => {
  const mod = await vi.importActual("@/utils/firebase");
  return {
    ...mod,
    saveItem: vi.fn(),
  };
});

vi.mock("@/store/useNotificationStore", () => {
  const mockedNotify = vi.fn();

  return {
    default: () => mockedNotify,
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
  default: ({ isOpen, onCancel, onSave }) => (
    <div data-testid="item-form" data-is-open={isOpen}>
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

describe("AddSubtaskModal", () => {
  const mockNotify = vi.mocked(useNotificationStore());
  const mockSaveItem = vi.mocked(saveItem);

  it("does not render the form when isOpen is false", () => {
    render(<AddSubtaskModal modalState={mockModalState} item={mockItem} />);

    expect(screen.queryByTestId("item-form")).not.toBeInTheDocument();
  });

  it("renders the form & calls 'close' when 'cancel' button is clicked", () => {
    render(
      <AddSubtaskModal
        modalState={{ ...mockModalState, isOpen: true }}
        item={mockItem}
      />
    );

    expect(screen.queryByTestId("item-form")).toBeInTheDocument();
    expect(screen.queryByTestId("item-form")).toHaveAttribute(
      "data-is-open",
      "true"
    );
    expect(mockModalState.close).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("cancel"));
    expect(mockModalState.close).toHaveBeenCalled();
  });

  it("passes correct data to 'saveItem' when form is submitted", () => {
    render(
      <AddSubtaskModal
        modalState={{ ...mockModalState, isOpen: true }}
        item={mockItem}
      />
    );

    expect(mockSaveItem).not.toHaveBeenCalled();
    expect(mockModalState.close).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("save"));

    expect(mockModalState.close).toHaveBeenCalled();
    expect(mockSaveItem).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "task",
        level: 1,
        parentId: "task",
        text: "text",
        startDate: "start-date",
        endDate: "end-date",
      }),
      mockNotify
    );
  });
});
