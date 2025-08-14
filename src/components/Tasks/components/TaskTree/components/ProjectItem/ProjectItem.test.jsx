import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ProjectItem from "./ProjectItem";
import useWindowSize from "@/hooks/useWindowSize";

vi.mock("@/hooks/useWindowSize", async () => ({
  default: vi.fn(() => "desktop"),
}));

vi.mock("../shared/ItemCardProgress/ItemCardProgress", async () => ({
  default: ({ completed, overall }) => (
    <div
      data-testid="progress"
      data-completed={completed}
      data-overall={overall}
    />
  ),
}));

vi.mock("../shared/ItemCardDateForm/ItemCardDateForm", async () => ({
  default: ({ itemId, defaultStartDate, defaultEndDate }) => (
    <div
      data-testid="date-form"
      data-item-id={itemId}
      data-start-date={defaultStartDate.toISOString()}
      data-end-date={defaultEndDate.toISOString()}
    />
  ),
}));

vi.mock("../shared/ItemCardMenu/ItemCardMenu", async () => ({
  default: ({ type, openAddSubtaskModal }) => (
    <div data-testid="card-menu" data-type={type}>
      <button
        data-testid="add-subtask"
        onClick={openAddSubtaskModal}
        type="button"
      />
    </div>
  ),
}));

vi.mock("../shared/AddSubtaskModal/AddSubtaskModal", async () => ({
  default: ({ modalState, item }) => (
    <div
      data-testid="add-subtask-modal"
      data-is-open={modalState.isOpen}
      data-item-id={item.id}
    />
  ),
}));

afterEach(() => {
  vi.resetAllMocks();
});

const mockItem = {
  id: "project-0",
  name: "My Project",
  type: "project",
  level: 0,
  icon: "folder",
  palette: "indigo",
  completed: false,
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-02-01"),
};
const mockChildren = [
  {
    id: "task-1",
    name: "My Task 1",
    type: "task",
    level: 1,
    completed: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-02-01"),
  },
  {
    id: "task-2",
    name: "My Task 2",
    type: "task",
    level: 1,
    completed: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-02-01"),
  },
  {
    id: "task-3",
    name: "My Task 3",
    type: "task",
    level: 1,
    completed: false,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-02-01"),
  },
];

describe("ProjectItem", () => {
  const mockUseWindowSize = vi.mocked(useWindowSize);

  it("renders ItemCardProgress with correct props", () => {
    render(<ProjectItem item={mockItem} childItems={mockChildren} />);

    const progressEl = screen.getByTestId("progress");

    expect(progressEl.dataset.overall).toBe("3");
    expect(progressEl.dataset.completed).toBe("2");
  });

  it("does not render ItemCardProgress when there are no children", () => {
    render(<ProjectItem item={mockItem} childItems={[]} />);

    expect(screen.queryByTestId("progress")).not.toBeInTheDocument();
  });

  it("does not render ItemCardProgress on phone", () => {
    mockUseWindowSize.mockReturnValue("phone");

    render(<ProjectItem item={mockItem} childItems={mockChildren} />);

    expect(screen.queryByTestId("progress")).not.toBeInTheDocument();
  });

  it("renders ItemCardDateForm with correct props", () => {
    render(<ProjectItem item={mockItem} childItems={mockChildren} />);

    const dateFormEl = screen.getByTestId("date-form");

    expect(dateFormEl.dataset.itemId).toBe(mockItem.id);
    expect(dateFormEl.dataset.startDate).toBe(mockItem.startDate.toISOString());
    expect(dateFormEl.dataset.endDate).toBe(mockItem.endDate.toISOString());
  });

  it("does not render ItemCardDateForm on tablet", () => {
    mockUseWindowSize.mockReturnValue("tablet");
    render(<ProjectItem item={mockItem} childItems={mockChildren} />);

    expect(screen.queryByTestId("date-form")).not.toBeInTheDocument();
  });

  it("does not render ItemCardDateForm on phone", () => {
    mockUseWindowSize.mockReturnValue("phone");
    render(<ProjectItem item={mockItem} childItems={mockChildren} />);

    expect(screen.queryByTestId("date-form")).not.toBeInTheDocument();
  });

  it("renders ItemCardMenu with correct type", () => {
    render(<ProjectItem item={mockItem} childItems={mockChildren} />);

    expect(screen.getByTestId("card-menu").dataset.type).toBe("project");
  });

  it("renders AddSubtaskModal with correct props", () => {
    render(<ProjectItem item={mockItem} childItems={mockChildren} />);

    const modal = screen.getByTestId("add-subtask-modal");

    expect(modal.dataset.isOpen).toBe("false");
    expect(modal.dataset.itemId).toBe(mockItem.id);
  });

  it("opens the modal when triggered from the menu", () => {
    render(<ProjectItem item={mockItem} childItems={mockChildren} />);

    const modal = screen.getByTestId("add-subtask-modal");

    expect(modal.dataset.isOpen).toBe("false");

    fireEvent.click(screen.getByTestId("add-subtask"));

    expect(modal.dataset.isOpen).toBe("true");
  });
});
