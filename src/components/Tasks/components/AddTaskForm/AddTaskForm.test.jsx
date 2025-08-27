import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import AddTaskForm from "./AddTaskForm";
import { resetToMidnight } from "@/utils/date";
import userEvent from "@testing-library/user-event";
import { DEFAULT_PROJECT_ID } from "@/consts/database";
import { useSaveItem } from "@/hooks/queries";

vi.mock("@/hooks/queries", async () => {
  const mockSaveItem = vi.fn();

  return {
    useSaveItem: () => mockSaveItem,
  };
});

vi.mock("./ProjectSelect/ProjectSelect", async () => ({
  default: ({ projectId, onChangeProject }) => (
    <div>
      <div data-testid="project-id" data-project-id={projectId} />
      <button
        data-testid="change-to-project-1"
        type="button"
        onClick={() => onChangeProject("project-1")}
      />
    </div>
  ),
}));

vi.mock("@/lib/CalendarPopup", async () => ({
  default: ({ startDate, endDate, onChangeStartDate, onChangeEndDate }) => (
    <div>
      <div data-testid="start-date" data-date={startDate.toISOString()} />
      <div data-testid="end-date" data-date={endDate.toISOString()} />
      <button
        data-testid="change-start-date"
        type="button"
        onClick={() => onChangeStartDate(new Date("2025-01-01"))}
      />
      <button
        data-testid="change-end-date"
        type="button"
        onClick={() => onChangeEndDate(new Date("2025-05-01"))}
      />
    </div>
  ),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("AddTaskForm", () => {
  const mockedSaveItem = vi.mocked(useSaveItem());

  it("renders with correct default values", () => {
    render(<AddTaskForm />);

    expect(screen.getByPlaceholderText("Текст")).toHaveValue("");

    expect(screen.getByTestId("project-id").dataset.projectId).toBe(
      DEFAULT_PROJECT_ID
    );

    const dateToday = resetToMidnight(new Date()).toISOString();
    expect(screen.getByTestId("start-date").dataset.date).toBe(dateToday);
    expect(screen.getByTestId("end-date").dataset.date).toBe(dateToday);
  });

  it("does not submit with empty text", async () => {
    const user = userEvent.setup();

    render(<AddTaskForm />);

    await user.click(screen.getByRole("button", { name: "Добавить" }));

    expect(mockedSaveItem).not.toHaveBeenCalled();
  });

  it("disables the submit button when loading", async () => {
    const user = userEvent.setup();
    mockedSaveItem.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    );

    render(<AddTaskForm />);
    const submitButton = screen.getByRole("button", { name: "Добавить" });

    await user.type(screen.getByPlaceholderText("Текст"), "Project");

    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it("passes correct state updating functions & calls saveItem with the correct object", async () => {
    const user = userEvent.setup();

    render(<AddTaskForm />);

    await user.type(screen.getByPlaceholderText("Текст"), "Project");

    fireEvent.click(screen.getByTestId("change-to-project-1"));
    fireEvent.click(screen.getByTestId("change-start-date"));
    fireEvent.click(screen.getByTestId("change-end-date"));

    expect(mockedSaveItem).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Добавить" }));

    expect(mockedSaveItem).toHaveBeenCalledWith({
      type: "task",
      level: 1,
      text: "Project",
      parentId: "project-1",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-05-01"),
    });
  });

  it("resets text after submission", async () => {
    const user = userEvent.setup();

    render(<AddTaskForm />);

    await user.type(screen.getByPlaceholderText("Текст"), "Project");
    await user.click(screen.getByRole("button", { name: "Добавить" }));

    expect(mockedSaveItem).toHaveBeenCalled();
    expect(screen.getByPlaceholderText("Текст")).toHaveValue("");
  });
});
