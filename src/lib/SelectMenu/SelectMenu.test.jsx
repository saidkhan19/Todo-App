import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import SelectMenu from "./SelectMenu";
import userEvent from "@testing-library/user-event";

const mockOptions = [
  { value: "item-1", name: "Item 1" },
  { value: "item-2", name: "Item 2" },
  { value: "item-3", name: "Item 3" },
  { value: "item-4", name: "Item 4" },
];

const mockOnChange = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe("SelectMenu", () => {
  it("correctly renders all options", () => {
    render(
      <SelectMenu
        options={mockOptions}
        selected="item-2"
        onChange={mockOnChange}
      />
    );

    const list = screen.getByRole("listbox");
    expect(list.children.length).toBe(mockOptions.length);

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(mockOptions.length);

    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[2]).toHaveAttribute("aria-selected", "false");
    expect(options[3]).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange when option is clicked", async () => {
    const user = userEvent.setup();
    render(
      <SelectMenu
        options={mockOptions}
        selected="item-2"
        onChange={mockOnChange}
      />
    );

    expect(mockOnChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("option", { name: "Item 3" }));

    expect(mockOnChange).toHaveBeenCalledWith("item-3");
  });

  it("shifts focus with Arrow Keys", async () => {
    const user = userEvent.setup();
    render(
      <SelectMenu
        options={mockOptions}
        selected="item-2"
        onChange={mockOnChange}
      />
    );

    expect(mockOnChange).not.toHaveBeenCalled();

    // Initially focused on item 2, go up to item 1
    await user.keyboard("[ArrowUp][Enter]");

    expect(mockOnChange).toHaveBeenLastCalledWith("item-1");

    // Go to the last item when ArrowUp is pressed again
    await user.keyboard("[ArrowUp][Enter]");
    expect(mockOnChange).toHaveBeenLastCalledWith("item-4");

    // Round to the first item when ArrowDown is pressed from the last item
    await user.keyboard("[ArrowDown][Enter]");
    expect(mockOnChange).toHaveBeenLastCalledWith("item-1");

    // Also works with the Space key
    await user.keyboard("[ArrowDown][Space]");
    expect(mockOnChange).toHaveBeenLastCalledWith("item-2");
  });

  it("changes focus after clicks", async () => {
    const user = userEvent.setup();
    render(
      <SelectMenu
        options={mockOptions}
        selected="item-2"
        onChange={mockOnChange}
      />
    );

    expect(mockOnChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("option", { name: "Item 3" }));

    expect(mockOnChange).toHaveBeenCalledWith("item-3");

    await user.keyboard("[ArrowDown][Space]");
    expect(mockOnChange).toHaveBeenLastCalledWith("item-4");
  });
});
