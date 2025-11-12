import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { mockItems } from "@/mocks/items";
import TaskGroup from "./TaskGroup";

vi.mock("motion/react", async () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  stagger: vi.fn(),
}));

vi.mock("../ItemCard/ItemCard", () => ({
  default: ({ item }) => <div data-testid={item.id} />,
}));

describe("TaskGroup", () => {
  it("renders all passed items", () => {
    render(<TaskGroup items={mockItems} />);

    mockItems.forEach((item) => {
      expect(screen.queryByTestId(item.id)).toBeInTheDocument();
    });
  });
});
