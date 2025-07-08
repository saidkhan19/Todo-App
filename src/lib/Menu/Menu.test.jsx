import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import Menu from "@/lib/Menu";
import useWindowSize from "@/hooks/useWindowSize";

vi.mock("@/hooks/useWindowSize", async () => ({ default: vi.fn() }));

vi.mock("./components/PopoverMenu", async () => ({
  default: ({ title, renderOpener, renderContent }) => (
    <div data-testid="popover-menu" data-title={title}>
      <button data-testid="render-opener" onClick={renderOpener} />
      <button data-testid="render-content" onClick={renderContent} />
    </div>
  ),
}));

vi.mock("./components/BottomSlideOverMenu", async () => ({
  default: ({ title, renderOpener, renderContent }) => (
    <div data-testid="bottom-slide-over-menu" data-title={title}>
      <button data-testid="render-opener" onClick={renderOpener} />
      <button data-testid="render-content" onClick={renderContent} />
    </div>
  ),
}));

afterEach(() => {
  vi.mocked(useWindowSize).mockReset();
  vi.clearAllMocks();
});

describe("Menu", () => {
  const mockOpener = vi.fn(() => <div data-testid="opener" />);
  const mockContent = vi.fn(() => <div data-testid="content" />);
  const mockUseWindowSize = vi.mocked(useWindowSize);

  it("renders BottomSlideOverMenu with correct props on phone", () => {
    mockUseWindowSize.mockReturnValue("phone");

    render(
      <Menu
        title="Bottom Slide Over"
        renderOpener={mockOpener}
        renderContent={mockContent}
      />
    );

    expect(screen.queryByTestId("bottom-slide-over-menu")).toBeInTheDocument();
    expect(screen.queryByTestId("bottom-slide-over-menu").dataset.title).toBe(
      "Bottom Slide Over"
    );

    fireEvent.click(screen.getByTestId("render-opener"));
    expect(mockOpener).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("render-content"));
    expect(mockContent).toHaveBeenCalled();
  });

  it("renders PopoverMenu with correct props on tablet", () => {
    mockUseWindowSize.mockReturnValue("tablet");

    render(
      <Menu
        title="Popover"
        renderOpener={mockOpener}
        renderContent={mockContent}
      />
    );

    expect(screen.queryByTestId("popover-menu")).toBeInTheDocument();
    expect(screen.queryByTestId("popover-menu").dataset.title).toBe("Popover");

    fireEvent.click(screen.getByTestId("render-opener"));
    expect(mockOpener).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("render-content"));
    expect(mockContent).toHaveBeenCalled();
  });
});
