import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { mockItems } from "@/mocks/items";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import analytics from "@/models/analytics";
import WeekStats from "./WeekStats";

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("lucide-react", () => ({
  BadgeInfo: (props) => <div data-testid="badge-info" {...props} />,
}));

vi.mock("@/lib/Tooltip", () => ({
  default: ({ renderOpener, renderContent, disabled }) => (
    <div data-testid="tooltip" data-disabled={disabled}>
      <div data-testid="opener">{renderOpener({ "data-test": true })}</div>
      <div data-testid="content">{renderContent()}</div>
    </div>
  ),
  TooltipContent: ({ children }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

vi.mock("@/models/analytics", () => {
  const countCompletedItems = vi.fn();
  const calculateProductivity = vi.fn();

  return { default: { countCompletedItems, calculateProductivity } };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("WeekStats", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);
  const mockCountCompletedItems = vi.mocked(analytics.countCompletedItems);
  const mockCalculateProductivity = vi.mocked(analytics.calculateProductivity);

  beforeEach(() => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: mockItems });
    mockCountCompletedItems.mockReturnValue({ completed: 5, overall: 10 });
    mockCalculateProductivity.mockReturnValue(10);
  });

  it("does not render anything when items are loading", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: true,
      error: null,
    });

    const { container } = render(<WeekStats />);

    expect(container.firstChild).toBeNull();
  });

  it("does not render anything when there is an error", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
      error: { message: "Error" },
    });

    const { container } = render(<WeekStats />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the information about the completed items", () => {
    render(<WeekStats />);

    const dataText = screen.queryByText("5 / 10");

    expect(dataText).toBeInTheDocument();

    const id = dataText.getAttribute("aria-describedby");
    const heading = document.getElementById(id);

    expect(within(heading).queryByText("Выполнено")).toBeInTheDocument();
  });

  it("renders the information about the productivity", () => {
    render(<WeekStats />);

    const dataText = screen.queryByText("10.0%");

    expect(dataText).toBeInTheDocument();

    const id = dataText.getAttribute("aria-describedby");
    const heading = document.getElementById(id);

    expect(within(heading).queryByText("Продуктивность")).toBeInTheDocument();
  });

  it("correctly renders the tooltips", () => {
    render(<WeekStats />);

    const tooltips = screen.queryAllByTestId("tooltip");

    // Contents of the first tooltip are rendered
    expect(within(tooltips[0]).queryByTestId("badge-info")).toBeInTheDocument();
    expect(
      within(tooltips[0]).queryByText("Задач выполнено за текущую неделю.")
    ).toBeInTheDocument();

    // Contents of the second tooltip are rendered
    expect(within(tooltips[1]).queryByTestId("badge-info")).toBeInTheDocument();
    expect(
      within(tooltips[1]).queryByText("Ежедневная выполняемость задач.")
    ).toBeInTheDocument();

    // Tooltip props are passed down
    for (const badge of screen.queryAllByTestId("badge-info")) {
      expect(badge.dataset.test).toBe("true");
    }
  });
});
