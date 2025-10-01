import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { mockItem, mockItems, mockProjectItem } from "@/mocks/items";
import { useDefaultProjectContext } from "@/components/DataProviders/DefaultProjectProvider";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getAllChildren, getProgressInformation } from "@/utils/dataTransforms";
import TaskCard from "./TaskCard";

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

vi.mock("@/components/DataProviders/DefaultProjectProvider", async () => ({
  useDefaultProjectContext: vi.fn(),
}));

vi.mock("@/components/UI/ProgressBar", async () => ({
  default: ({ value }) => <div data-testid="progress-bar" data-value={value} />,
}));

vi.mock("@/components/shared/CompleteTaskCheckbox", async () => ({
  default: ({ item }) => (
    <div data-testid="complete-checkbox" data-id={item.id} />
  ),
}));

vi.mock("@/utils/dataTransforms", async () => ({
  getRootProject: () => mockProjectItem,
  getAllChildren: vi.fn(),
  getProgressInformation: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("TaskCard", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);
  const mockUseDefaultProjectContext = vi.mocked(useDefaultProjectContext);

  const mockGetAllChildren = vi.mocked(getAllChildren);
  const mockGetProgressInformation = vi.mocked(getProgressInformation);

  beforeEach(() => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: mockItems });
    mockUseDefaultProjectContext.mockReturnValue({
      defaultProject: mockProjectItem,
    });

    mockGetAllChildren.mockReturnValue(mockItems);
    mockGetProgressInformation.mockReturnValue({ completed: 5, overall: 10 });
  });

  it("does not render anything when default project is null", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: [] });
    mockUseDefaultProjectContext.mockReturnValue({ defaultProject: null });

    const { container } = render(<TaskCard task={mockItem} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders a link to the corresponding task in tasks page", () => {
    render(<TaskCard task={mockItem} />);

    const link = screen.queryByRole("link", { name: mockItem.text });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/tasks#${mockItem.id}`);
  });

  it("correctly renders the checkbox", () => {
    render(<TaskCard task={mockItem} />);

    const checkbox = screen.queryByTestId("complete-checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.dataset.id).toBe(mockItem.id);
  });

  it("does not render the progress bar when item has no children", () => {
    mockGetAllChildren.mockReturnValue([]);

    render(<TaskCard task={mockItem} />);

    expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
  });

  it("correctly renders the progress bar", () => {
    render(<TaskCard task={mockItem} />);

    const progressBar = screen.queryByTestId("progress-bar");

    expect(progressBar).toBeInTheDocument();
    expect(+progressBar.dataset.value).toBe(50);
  });
});
