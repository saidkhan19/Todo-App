import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ColorFieldset from "./ColorFieldset";
import { COLOR_PALETTES, ICONS } from "@/consts/projects";
import IconFieldset from "./IconFieldset";

const mockSetProject = vi.fn();
const mockSetIcon = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe("ColorFieldset", () => {
  it("renders all palettes", () => {
    const { container } = render(
      <ColorFieldset paletteId="indigo" setProjectPalette={mockSetProject} />
    );

    const inputs = container.querySelectorAll("input");

    inputs.forEach((item, idx) => {
      expect(item).toHaveAttribute("value", COLOR_PALETTES[idx].id);

      if (item.value === "indigo") {
        expect(item).toBeChecked();
      } else {
        expect(item).not.toBeChecked();
      }
    });
  });

  it("calls onChange with correct paletteId", () => {
    render(
      <ColorFieldset paletteId="indigo" setProjectPalette={mockSetProject} />
    );

    expect(mockSetProject).not.toHaveBeenCalled();

    fireEvent.click(screen.getByDisplayValue("orange"));
    expect(mockSetProject).toHaveBeenCalledWith("orange");

    fireEvent.click(screen.getByDisplayValue("blue"));
    expect(mockSetProject).toHaveBeenCalledWith("blue");
  });
});

describe("IconFieldset", () => {
  it("renders all icons", () => {
    const { container } = render(
      <IconFieldset iconId="folder" setProjectIcon={mockSetIcon} />
    );

    const inputs = container.querySelectorAll("input");

    inputs.forEach((item, idx) => {
      expect(item).toHaveAttribute("value", ICONS[idx].id);

      if (item.value === "folder") {
        expect(item).toBeChecked();
      } else {
        expect(item).not.toBeChecked();
      }
    });
  });

  it("calls onChange with correct iconId", () => {
    render(<IconFieldset iconId="folder" setProjectIcon={mockSetIcon} />);

    expect(mockSetIcon).not.toHaveBeenCalled();

    fireEvent.click(screen.getByDisplayValue("laptop"));
    expect(mockSetIcon).toHaveBeenCalledWith("laptop");

    fireEvent.click(screen.getByDisplayValue("home"));
    expect(mockSetIcon).toHaveBeenCalledWith("home");
  });
});
