import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import CompleteTaskCheckbox from ".";
import userEvent from "@testing-library/user-event";
import { useUpdateItem } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => {
  const mockUpdateItem = vi.fn();

  return {
    useUpdateItem: () => mockUpdateItem,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockItem = {
  id: "task",
  text: "My Task",
  completed: false,
};

describe("CompleteTaskCheckbox", () => {
  const mockUpdateItem = vi.mocked(useUpdateItem());

  it("renders with correct default value", () => {
    render(<CompleteTaskCheckbox item={mockItem} />);

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("calls 'updateItem' with correct arguments when checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(<CompleteTaskCheckbox item={mockItem} />);

    expect(mockUpdateItem).not.toHaveBeenCalled();

    await user.click(screen.getByRole("checkbox"));

    expect(mockUpdateItem).toHaveBeenCalledWith(
      mockItem.id,
      expect.objectContaining({ completed: true })
    );
  });
});
