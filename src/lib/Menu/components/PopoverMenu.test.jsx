import { describe, it, vi, expect, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PopoverMenu from "./PopoverMenu";

const mockOpener = vi.fn((props) => <div data-testid="opener" {...props} />);
const mockContent = vi.fn(() => <div data-testid="content" />);

afterEach(() => {
  vi.clearAllMocks();
});

describe("PopoverMenu", () => {
  it("renders only the opener when closed", () => {
    render(
      <PopoverMenu
        title="Popover"
        renderOpener={mockOpener}
        renderContent={mockContent}
      />
    );

    expect(mockOpener).toHaveBeenCalled();
    expect(mockContent).not.toHaveBeenCalled();

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("renders content when opener is pressed", async () => {
    const user = userEvent.setup();

    render(
      <PopoverMenu
        title="Popover"
        renderOpener={mockOpener}
        renderContent={mockContent}
      />
    );

    expect(mockContent).not.toHaveBeenCalled();
    await user.click(screen.getByTestId("opener"));

    expect(mockContent).toHaveBeenCalled();
    expect(screen.queryByTestId("content")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Popover" })
    ).toBeInTheDocument();
  });

  it("closes the popover when 'close' button is clicked or 'escape' key is pressed", async () => {
    const user = userEvent.setup();

    render(
      <PopoverMenu
        title="Popover"
        renderOpener={mockOpener}
        renderContent={mockContent}
      />
    );
    await user.click(screen.getByTestId("opener"));
    expect(screen.queryByTestId("content")).toBeInTheDocument();

    // Closed when 'close' button is pressed
    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("opener"));
    expect(screen.queryByTestId("content")).toBeInTheDocument();

    // Closed when 'escape' key is pressed
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("closes the popover when clicked outside of the popover", async () => {
    const user = userEvent.setup();

    render(
      <PopoverMenu
        title="Popover"
        renderOpener={mockOpener}
        renderContent={mockContent}
      />
    );
    await user.click(screen.getByTestId("opener"));
    expect(screen.queryByTestId("content")).toBeInTheDocument();

    // Press on the slideover first
    fireEvent.click(screen.queryByTestId("content"));
    expect(screen.queryByTestId("content")).toBeInTheDocument();

    // Press outside the slideover
    await user.click(screen.getByTestId("opener").parentElement);
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });
});
