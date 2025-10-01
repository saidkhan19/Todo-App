import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import TasksForToday from "./TasksForToday";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { FirebaseError } from "firebase/app";

vi.mock("motion/react", async () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
}));

vi.mock("react-router", async () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

vi.mock("@/components/UI/StatusMessage", async () => ({
  default: ({ message }) => (
    <div data-testid="status-message" data-message={message} />
  ),
}));

vi.mock("../TaskCard/TaskCard", async () => ({
  default: ({ task }) => <div data-testid="task-card" data-id={task.id} />,
}));

vi.mock("@/utils/dataTransforms", async () => ({
  getTasksForToday: (items) => items,
  orderItemsByOrder: (items) => items,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("TasksForToday", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);

  it("shows a loading spinner when tasks are loading", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: true,
      error: null,
    });
    render(<TasksForToday />);
    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });

  it("shows error when there is an error", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
      error: new FirebaseError(),
    });
    render(<TasksForToday />);
    expect(screen.getByTestId("status-message")).toBeInTheDocument();
  });

  it("does not render items when there are no items", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
      error: null,
    });
    render(<TasksForToday />);

    expect(screen.queryByTestId("task-card")).not.toBeInTheDocument();

    const status = screen.queryByTestId("status-message");
    expect(status).toBeInTheDocument();
    expect(status.dataset.message).toBe("Задач на сегодня не найдено.");
  });

  it("renders all available items", () => {
    const mockTasks = [{ id: "task-1" }, { id: "task-2" }, { id: "task-3" }];

    mockUseProjectsAndTasksContext.mockReturnValue({
      items: mockTasks,
      loading: false,
      error: null,
    });
    render(<TasksForToday />);

    const tasks = screen.queryAllByTestId("task-card");

    tasks.forEach((task, index) => {
      expect(task.dataset.id).toBe(mockTasks[index].id);
    });
  });
});
