import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Modal from "./Modal";

describe("Modal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders nothing when closed", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children when open", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByText("Content")).toBeInTheDocument();
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<Modal isOpen={true} onClose={mockOnClose} />);

    expect(mockOnClose).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when pressed outside of the modal", async () => {
    const user = userEvent.setup();
    render(<Modal isOpen={true} onClose={mockOnClose} />);

    // Press on the modal first
    const modal = screen.getByRole("dialog");
    fireEvent.click(modal);
    expect(mockOnClose).not.toHaveBeenCalled();

    // Press on overlay
    const overlay = modal.parentElement;
    await user.click(overlay);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
