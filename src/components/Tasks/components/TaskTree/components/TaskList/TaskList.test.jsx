import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { useContext } from "react";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import TaskList from "./TaskList";
import { mockItems } from "@/mocks/items";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  return {
    ...mod,
    useContext: vi.fn(),
  };
});

vi.mock("../ItemCard/ItemCard", () => ({
  default: ({ item }) => <div data-testid={item.id} />,
}));

vi.mock("@/hooks/useFirebaseErrorNotification", async () => ({
  default: vi.fn(),
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("TaskList", () => {
  const mockUseContext = vi.mocked(useContext);
  const mockUseFirebaseErrorNotification = vi.mocked(
    useFirebaseErrorNotification
  );

  it("shows loading spinner when items are loading", () => {
    mockUseContext.mockReturnValue({
      loadingItems: true,
      errorItems: null,
      getRootItems: () => [],
    });
    render(<TaskList />);

    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });

  it("notifies about an error", () => {
    mockUseContext.mockReturnValue({
      loadingItems: false,
      errorItems: "Error",
      getRootItems: () => [],
    });
    render(<TaskList />);

    expect(mockUseFirebaseErrorNotification).toBeCalledWith("Error");
  });

  it("renders empty page when the are no items", () => {
    mockUseContext.mockReturnValue({
      loadingItems: false,
      errorItems: null,
      getRootItems: () => [],
    });
    render(<TaskList />);

    expect(screen.queryByText(/Ничего не найдено\./)).toBeInTheDocument();
  });

  it("renders items when they are available", () => {
    mockUseContext.mockReturnValue({
      loadingItems: false,
      errorItems: null,
      getRootItems: () => mockItems,
    });
    render(<TaskList />);

    mockItems.forEach((item) => {
      expect(screen.queryByTestId(item.id)).toBeInTheDocument();
    });
  });
});
