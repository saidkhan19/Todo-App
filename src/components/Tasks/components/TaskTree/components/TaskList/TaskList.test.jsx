import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import TaskList from "./TaskList";
import { mockItems } from "@/mocks/items";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getRootItems } from "@/utils/dataTransforms";
import { FirebaseError } from "firebase/app";

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(() => ({
    items: mockItems,
    loading: false,
  })),
}));

vi.mock("@/components/UI/StatusMessage", async () => ({
  default: () => <div data-testid="status-message" />,
}));

vi.mock("../ItemCard/ItemCard", () => ({
  default: ({ item }) => <div data-testid={item.id} />,
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("TaskList", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);

  it("shows loading spinner when items are loading", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: mockItems,
      loading: true,
    });
    render(<TaskList />);

    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });

  it("shows error when there is an error", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
      error: new FirebaseError(),
    });
    render(<TaskList />);
    expect(screen.getByTestId("status-message")).toBeInTheDocument();
  });

  it("renders empty page when the are no items", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
    });
    render(<TaskList />);

    expect(screen.queryByText(/Ничего не найдено\./)).toBeInTheDocument();
  });

  it("renders items when they are available", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: mockItems,
    });
    render(<TaskList />);

    getRootItems(mockItems).forEach((item) => {
      expect(screen.queryByTestId(item.id)).toBeInTheDocument();
    });
  });
});
