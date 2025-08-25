import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import TaskItem from "./TaskItem";
import useWindowSize from "@/hooks/useWindowSize";
import { useDeleteItem } from "@/hooks/queries";
import { MAX_NESTING_LEVEL } from "@/consts";

vi.mock("@/hooks/useWindowSize", async () => ({
  default: vi.fn(() => "desktop"),
}));

vi.mock("@/hooks/queries", () => {
  const mockDelete = vi.fn();
  return {
    useDeleteItem: () => mockDelete,
  };
});

vi.mock("@/components/shared/CompleteTaskCheckbox", async () => ({
  default: ({ item }) => <div data-testid="checkbox" data-item-id={item.id} />,
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
  default: ({
    type,
    openAddSubtaskModal,
    displayAddSubtaskModal,
    openUpdateTaskModal,
    onDeleteTask,
  }) => (
    <div data-testid="card-menu" data-type={type}>
      {displayAddSubtaskModal && (
        <button
          data-testid="add-subtask"
          onClick={openAddSubtaskModal}
          type="button"
        />
      )}
      <button data-testid="update-task" onClick={openUpdateTaskModal} />
      <button data-testid="delete-task" onClick={onDeleteTask} />
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

vi.mock("../shared/UpdateTaskModal/UpdateTaskModal", async () => ({
  default: ({ modalState, item }) => (
    <div
      data-testid="update-task-modal"
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

describe("TaskItem", () => {
  const mockUseWindowSize = vi.mocked(useWindowSize);
  const mockDelete = vi.mocked(useDeleteItem());

  it("renders CompleteTaskCheckbox with correct props", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    expect(screen.getByTestId("checkbox").dataset.itemId).toBe(mockItem.id);
  });

  it("renders ItemCardProgress with correct props", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    const progressEl = screen.getByTestId("progress");

    expect(progressEl.dataset.overall).toBe("3");
    expect(progressEl.dataset.completed).toBe("2");
  });

  it("does not render ItemCardProgress when there are no children", () => {
    render(<TaskItem item={mockItem} childItems={[]} />);

    expect(screen.queryByTestId("progress")).not.toBeInTheDocument();
  });

  it("does not render ItemCardProgress on phone", () => {
    mockUseWindowSize.mockReturnValue("phone");

    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    expect(screen.queryByTestId("progress")).not.toBeInTheDocument();
  });

  it("renders ItemCardDateForm with correct props", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    const dateFormEl = screen.getByTestId("date-form");

    expect(dateFormEl.dataset.itemId).toBe(mockItem.id);
    expect(dateFormEl.dataset.startDate).toBe(mockItem.startDate.toISOString());
    expect(dateFormEl.dataset.endDate).toBe(mockItem.endDate.toISOString());
  });

  it("does not render ItemCardDateForm on tablet", () => {
    mockUseWindowSize.mockReturnValue("tablet");
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    expect(screen.queryByTestId("date-form")).not.toBeInTheDocument();
  });

  it("does not render ItemCardDateForm on phone", () => {
    mockUseWindowSize.mockReturnValue("phone");
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    expect(screen.queryByTestId("date-form")).not.toBeInTheDocument();
  });

  it("renders ItemCardMenu with correct type", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    expect(screen.getByTestId("card-menu").dataset.type).toBe("task");
  });

  it("does not render Add Subtask button & modal when >= MAX_NESTING_LEVEL", () => {
    render(
      <TaskItem
        item={{ ...mockItem, level: MAX_NESTING_LEVEL }}
        childItems={mockChildren}
      />
    );

    expect(screen.queryByTestId("add-subtask")).not.toBeInTheDocument();
    expect(screen.queryByTestId("add-subtask-modal")).not.toBeInTheDocument();
  });

  it("renders AddSubtaskModal with correct props", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    const modal = screen.getByTestId("add-subtask-modal");

    expect(modal.dataset.isOpen).toBe("false");
    expect(modal.dataset.itemId).toBe(mockItem.id);
  });

  it("renders UpdateTaskModal with correct props", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    const modal = screen.getByTestId("update-task-modal");

    expect(modal.dataset.isOpen).toBe("false");
    expect(modal.dataset.itemId).toBe(mockItem.id);
  });

  it("opens the add subtask modal when triggered from the menu", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    const modal = screen.getByTestId("add-subtask-modal");

    expect(modal.dataset.isOpen).toBe("false");

    fireEvent.click(screen.getByTestId("add-subtask"));

    expect(modal.dataset.isOpen).toBe("true");
  });

  it("opens the update task modal when triggered from the menu", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    const modal = screen.getByTestId("update-task-modal");

    expect(modal.dataset.isOpen).toBe("false");

    fireEvent.click(screen.getByTestId("update-task"));

    expect(modal.dataset.isOpen).toBe("true");
  });

  it("calls delete callback when triggered from the menu", () => {
    render(<TaskItem item={mockItem} childItems={mockChildren} />);

    expect(mockDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("delete-task"));

    expect(mockDelete).toHaveBeenCalled();
  });
});
