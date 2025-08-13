import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ItemForm from "./ItemForm";

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

describe("ItemForm", () => {
  const mockSave = vi.fn();
  const mockCancel = vi.fn();

  it("sets correct default values", async () => {
    const user = userEvent.setup();

    render(
      <ItemForm
        title="Test form"
        isOpen={true}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const nameInput = screen.getByPlaceholderText("Текст");
    expect(nameInput).toHaveValue("");

    await user.type(nameInput, "task-1");
    await user.click(screen.getByRole("button", { name: "Сохранить" }));

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "task-1",
        startDate: expect.toBeSameDate(new Date()),
        endDate: expect.toBeSameDate(new Date()),
      })
    );
  });

  it("sets correct default values from props", async () => {
    render(
      <ItemForm
        title="Test form"
        isOpen={true}
        onSave={mockSave}
        onCancel={mockCancel}
        defaultText="task-1"
        defaultStartDate={new Date()}
        defaultEndDate={new Date()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "task-1",
        startDate: expect.toBeSameDate(new Date()),
        endDate: expect.toBeSameDate(new Date()),
      })
    );
  });

  it("prevents saving when name is not set", async () => {
    const user = userEvent.setup();
    render(
      <ItemForm
        title="Test form"
        isOpen={true}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    await user.click(screen.getByRole("button", { name: "Сохранить" }));
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("updates form and calls onSave with correct data", async () => {
    const user = userEvent.setup();

    render(
      <ItemForm
        title="Test form"
        isOpen={true}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    await user.type(screen.getByPlaceholderText("Текст"), "task-1");
    fireEvent.click(screen.getByTestId("set-new-date"));

    await user.click(screen.getByRole("button", { name: "Сохранить" }));
    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "task-1",
        startDate: expect.toBeSameDate(new Date("2025-01-01")),
        endDate: expect.toBeSameDate(new Date("2025-01-31")),
      })
    );
  });

  it("calls onCancel when cancel button is pressed", async () => {
    const user = userEvent.setup();

    render(
      <ItemForm
        title="Test form"
        isOpen={true}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    expect(mockCancel).not.toHaveBeenCalled();
    await user.click(screen.queryByRole("button", { name: "Отмена" }));

    expect(mockCancel).toHaveBeenCalled();
  });
});
