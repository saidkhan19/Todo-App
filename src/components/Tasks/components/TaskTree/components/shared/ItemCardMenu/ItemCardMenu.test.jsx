import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import ItemCardMenu from "./ItemCardMenu";

vi.mock("@/lib/Menu", async () => {
  const Menu = ({ title, renderOpener, renderContent }) => {
    const [isOpen, setIsOpen] = useState(true);
    const handleClose = () => setIsOpen(false);

    return (
      <div>
        <div data-testid="state" data-state={isOpen} />
        <div data-testid="title">{title}</div>
        <div data-testid="opener">{renderOpener()}</div>
        <div data-testid="content">{renderContent(handleClose)}</div>
      </div>
    );
  };

  return {
    default: Menu,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("ItemCardMenu", () => {
  const mockOpenAddSubtaskModal = vi.fn();
  const mockOpenUpdateTaskModal = vi.fn();
  const mockOnDeleteTask = vi.fn();

  it("renders only add subtask button for projects", () => {
    render(
      <ItemCardMenu
        type="project"
        openAddSubtaskModal={mockOpenAddSubtaskModal}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Добавить подзадачу" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Изменить задачу" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Удалить задачу" })
    ).not.toBeInTheDocument();
  });

  it("calls add subtask callback & closes the modal", async () => {
    const user = userEvent.setup();

    render(
      <ItemCardMenu
        type="project"
        openAddSubtaskModal={mockOpenAddSubtaskModal}
      />
    );

    expect(mockOpenAddSubtaskModal).not.toHaveBeenCalled();
    expect(screen.getByTestId("state").dataset.state).toBe("true");
    await user.click(
      screen.queryByRole("button", { name: "Добавить подзадачу" })
    );

    expect(mockOpenAddSubtaskModal).toHaveBeenCalled();
    expect(screen.getByTestId("state").dataset.state).toBe("false");
  });

  it("renders all buttons for tasks", () => {
    render(
      <ItemCardMenu
        type="task"
        openAddSubtaskModal={mockOpenAddSubtaskModal}
        openUpdateTaskModal={mockOpenUpdateTaskModal}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Добавить подзадачу" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Изменить задачу" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Удалить задачу" })
    ).toBeInTheDocument();
  });

  it("calls update task callback & closes the modal", async () => {
    const user = userEvent.setup();

    render(
      <ItemCardMenu
        type="task"
        openAddSubtaskModal={mockOpenAddSubtaskModal}
        openUpdateTaskModal={mockOpenUpdateTaskModal}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    expect(mockOpenUpdateTaskModal).not.toHaveBeenCalled();
    expect(screen.getByTestId("state").dataset.state).toBe("true");
    await user.click(screen.queryByRole("button", { name: "Изменить задачу" }));

    expect(mockOpenUpdateTaskModal).toHaveBeenCalled();
    expect(screen.getByTestId("state").dataset.state).toBe("false");
  });

  it("calls delete callback when delete is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ItemCardMenu
        type="task"
        openAddSubtaskModal={mockOpenAddSubtaskModal}
        openUpdateTaskModal={mockOpenUpdateTaskModal}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    expect(mockOnDeleteTask).not.toHaveBeenCalled();

    await user.click(screen.queryByRole("button", { name: "Удалить задачу" }));

    expect(mockOnDeleteTask).toHaveBeenCalled();
  });

  it("does not render add subtask button when it is passed as false", () => {
    render(
      <ItemCardMenu
        type="task"
        openAddSubtaskModal={mockOpenAddSubtaskModal}
        displayAddSubtaskModal={false}
        openUpdateTaskModal={mockOpenUpdateTaskModal}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Добавить подзадачу" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Изменить задачу" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Удалить задачу" })
    ).toBeInTheDocument();
  });
});
