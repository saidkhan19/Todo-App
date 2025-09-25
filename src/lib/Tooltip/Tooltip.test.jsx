import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Tooltip from "./Tooltip";

const mockOpener = vi.fn((props) => <div data-testid="opener" {...props} />);
const mockContent = vi.fn(() => <div data-testid="content" />);

afterEach(() => {
  vi.clearAllMocks();
});

describe("Tooltip", () => {
  it("renders only the tooltip opener initially", () => {
    render(<Tooltip renderOpener={mockOpener} renderContent={mockContent} />);

    expect(mockOpener).toHaveBeenCalled();
    expect(mockContent).not.toHaveBeenCalled();

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("renders the content when the user hovers over the tooltip", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        renderOpener={mockOpener}
        renderContent={mockContent}
        openDelay={0}
      />
    );

    await user.hover(screen.getByTestId("opener"));

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).toBeInTheDocument();
  });

  it("renders the content when the opener is focused", () => {
    render(
      <Tooltip
        renderOpener={mockOpener}
        renderContent={mockContent}
        openDelay={0}
      />
    );

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();

    fireEvent.focus(screen.getByTestId("opener"));

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).toBeInTheDocument();
  });

  it("does not render content when disabled", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        renderOpener={mockOpener}
        renderContent={mockContent}
        openDelay={0}
        disabled={true}
      />
    );

    expect(screen.queryByTestId("content")).not.toBeInTheDocument();

    // Focus does not render
    fireEvent.focus(screen.getByTestId("opener"));
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();

    // Hover does not render
    await user.hover(screen.getByTestId("opener"));
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("hides the content when clicked outside the tooltip", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        renderOpener={mockOpener}
        renderContent={mockContent}
        openDelay={0}
      />
    );
    await user.hover(screen.getByTestId("opener"));

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).toBeInTheDocument();

    await user.click(screen.getByTestId("opener").parentElement);

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("hides the content when escape key is pressed", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        renderOpener={mockOpener}
        renderContent={mockContent}
        openDelay={0}
      />
    );
    await user.hover(screen.getByTestId("opener"));

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).toBeInTheDocument();

    await user.keyboard("[Escape]");

    expect(screen.queryByTestId("opener")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });
});
