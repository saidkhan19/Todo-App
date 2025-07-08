import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProjectForm from "./ProjectForm";

vi.mock("./components/ProjectSymbolPicker/ProjectSymbolPicker", () => ({
  default: ({ setProjectPalette, setProjectIcon }) => (
    <div data-testid="symbol-picker">
      <button
        type="button"
        data-testid="set-new-palette"
        onClick={() => setProjectPalette("custom-palette")}
      />
      <button
        type="button"
        data-testid="set-new-icon"
        onClick={() => setProjectIcon("custom-icon")}
      />
    </div>
  ),
}));

vi.mock("@/lib/CalendarPopup", () => ({
  default: ({ onChangeStartDate, onChangeEndDate }) => {
    const handleChangeDate = () => {
      onChangeStartDate(new Date("2025-01-01"));
      onChangeEndDate(new Date("2025-01-31"));
    };

    return (
      <div data-testid="calendar-popup">
        <button
          type="button"
          data-testid="set-new-date"
          onClick={handleChangeDate}
        />
      </div>
    );
  },
}));

expect.extend({
  toBeSameDate(received, expected) {
    let pass = false;
    if (received instanceof Date && expected instanceof Date) {
      let d1 = new Date(received);
      let d2 = new Date(expected);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
      pass = d1.getTime() === d2.getTime();
    }

    return {
      pass,
      message: () =>
        `expected ${received} ${
          pass ? "not " : ""
        }to be same date as ${expected}`,
    };
  },
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  delete expect.toBeSameDate;
});

describe("ProjectForm", () => {
  const mockSave = vi.fn();
  const mockCancel = vi.fn();
  const mockDelete = vi.fn();

  it("sets correct default values", async () => {
    const user = userEvent.setup();
    render(
      <ProjectForm isOpen={true} onSave={mockSave} onCancel={mockCancel} />
    );

    const nameInput = screen.getByPlaceholderText("Название");
    expect(nameInput).toHaveValue("");

    await user.type(nameInput, "project-1");
    await user.click(screen.getByRole("button", { name: "Сохранить" }));
    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        projectName: "project-1",
        projectIcon: "folder",
        projectPalette: "indigo",
        projectStartDate: expect.toBeSameDate(new Date()),
        projectEndDate: expect.toBeSameDate(new Date()),
      })
    );

    // By default type='create', therefore 'Delete' button should not be rendered
    expect(
      screen.queryByRole("button", { name: "Удалить" })
    ).not.toBeInTheDocument();
  });

  it("prevents saving when name is not set", async () => {
    const user = userEvent.setup();
    render(
      <ProjectForm isOpen={true} onSave={mockSave} onCancel={mockCancel} />
    );

    await user.click(screen.getByRole("button", { name: "Сохранить" }));
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("updates form and calls onSave with correct data", async () => {
    const user = userEvent.setup();

    render(
      <ProjectForm isOpen={true} onSave={mockSave} onCancel={mockCancel} />
    );

    await user.type(screen.getByPlaceholderText("Название"), "project-1");

    fireEvent.click(screen.getByTestId("set-new-palette"));
    fireEvent.click(screen.getByTestId("set-new-icon"));
    fireEvent.click(screen.getByTestId("set-new-date"));

    await user.click(screen.getByRole("button", { name: "Сохранить" }));
    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        projectName: "project-1",
        projectIcon: "custom-icon",
        projectPalette: "custom-palette",
        projectStartDate: expect.toBeSameDate(new Date("2025-01-01")),
        projectEndDate: expect.toBeSameDate(new Date("2025-01-31")),
      })
    );
  });

  it("renders correctly when type='update'", async () => {
    const user = userEvent.setup();

    render(
      <ProjectForm
        type="update"
        isOpen={true}
        onSave={mockSave}
        onCancel={mockCancel}
        onDelete={mockDelete}
      />
    );

    expect(
      screen.queryByRole("heading", { name: "Изменить проект" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Удалить" })
    ).toBeInTheDocument();

    expect(mockDelete).not.toHaveBeenCalled();
    await user.click(screen.queryByRole("button", { name: "Удалить" }));
    expect(mockDelete).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is pressed", async () => {
    const user = userEvent.setup();

    render(
      <ProjectForm isOpen={true} onSave={mockSave} onCancel={mockCancel} />
    );

    await user.click(screen.queryByRole("button", { name: "Отмена" }));
    expect(mockCancel).toHaveBeenCalled();
  });
});
