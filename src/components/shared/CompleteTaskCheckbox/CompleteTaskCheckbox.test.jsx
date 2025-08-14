import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import useNotificationStore from "@/store/useNotificationStore";
import { updateItem } from "@/utils/firebase";
import CompleteTaskCheckbox from ".";
import userEvent from "@testing-library/user-event";

vi.mock("@/store/useNotificationStore", () => {
  const mockedNotify = vi.fn();

  return {
    default: () => mockedNotify,
  };
});

vi.mock("@/utils/firebase", async () => {
  const mod = await vi.importActual("@/utils/firebase");
  return {
    ...mod,
    updateItem: vi.fn(),
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
  const mockNotify = vi.mocked(useNotificationStore());
  const mockUpdateItem = vi.mocked(updateItem);

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
      expect.objectContaining({ completed: true }),
      mockNotify
    );
  });
});
