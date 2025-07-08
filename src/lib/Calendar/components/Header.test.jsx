import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Header from "./Header";
import { useContext } from "react";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  const currentView = new Date("2025-01-01");
  const setPreviousMonth = vi.fn();
  const setNextMonth = vi.fn();

  return {
    ...mod,
    useContext: vi.fn(() => ({
      currentView,
      setPreviousMonth,
      setNextMonth,
    })),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Calendar Header", () => {
  const { setPreviousMonth, setNextMonth } = useContext();

  it("renders today's date in the right format", () => {
    render(<Header />);

    expect(screen.queryByLabelText("Текущий месяц")).toBeInTheDocument();
    expect(screen.queryByLabelText("Текущий месяц")).toHaveTextContent(
      "Январь 2025"
    );
  });

  it("calls setPreviousMonth when 'left' button is clicked", async () => {
    const user = userEvent.setup();

    render(<Header />);

    expect(setPreviousMonth).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Предыдущий месяц" }));

    expect(setPreviousMonth).toHaveBeenCalled();
  });

  it("calls setNextMonth when 'right' button is clicked", async () => {
    const user = userEvent.setup();

    render(<Header />);

    expect(setNextMonth).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Следующий месяц" }));

    expect(setNextMonth).toHaveBeenCalled();
  });
});
