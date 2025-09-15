import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { FirebaseError } from "firebase/app";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import GridContent from "./GridContent";
import Content from "./Content";

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", async () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

vi.mock("@/components/UI/StatusMessage", () => ({
  default: ({ title, type, message }) => (
    <div
      data-testid="status-message"
      data-title={title}
      data-type={type}
      data-message={message}
    />
  ),
}));

vi.mock("./Content", () => ({
  default: vi.fn(() => <div data-testid="content" />),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GridContent", () => {
  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);

  it("shows the loading spinner when data has not loaded", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: true,
      error: null,
    });

    render(<GridContent />);

    expect(screen.queryByTestId("spinner-box")).toBeInTheDocument();

    // Does not render the Content
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("shows the error status when there is a Firebase error", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({
      items: [],
      loading: false,
      error: new FirebaseError(),
    });

    render(<GridContent />);

    const statusMessage = screen.queryByTestId("status-message");

    expect(statusMessage).toBeInTheDocument();

    // Message has correct data
    expect(statusMessage.dataset.title).toBe("Ошибка");
    expect(statusMessage.dataset.type).toBe("error");
    expect(statusMessage.dataset.message).toBeTruthy();

    // Does not render the Content
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("renders the Content when items are defined", () => {
    const items = [];
    mockUseProjectsAndTasksContext.mockReturnValue({
      items,
      loading: false,
      error: null,
    });

    render(<GridContent />);

    expect(screen.queryByTestId("content")).toBeInTheDocument();

    expect(Content).toHaveBeenCalledWith(
      expect.objectContaining({ items }),
      undefined
    );
  });
});
