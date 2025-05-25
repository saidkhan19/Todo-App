import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useAuthState } from "react-firebase-hooks/auth";

import ProtectedRoute from "./ProtectedRoute";

vi.mock("react-firebase-hooks/auth", async () => ({
  useAuthState: vi.fn(),
}));

vi.mock("react-router", async () => {
  const mockNavigate = ({ to }) => <div data-testid="navigate" data-to={to} />;
  const mockOutlet = () => <div data-testid="outlet" />;

  return {
    Navigate: mockNavigate,
    Outlet: mockOutlet,
  };
});

vi.mock("../UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner" />,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("ProtectedRoute", async () => {
  const mockUseAuthState = vi.mocked(useAuthState);

  it("renders spinner when loading is true", () => {
    mockUseAuthState.mockReturnValue([null, true, undefined]);
    render(<ProtectedRoute />);

    expect(screen.queryByTestId("spinner")).toBeInTheDocument();
  });

  it("redirects when user is null", () => {
    mockUseAuthState.mockReturnValue([null, false, undefined]);
    render(<ProtectedRoute />);

    const navigateElement = screen.queryByTestId("navigate");
    expect(navigateElement).toHaveAttribute("data-to", "/auth");
  });

  it("redirects when error happened", () => {
    mockUseAuthState.mockReturnValue([{}, false, { message: "Error" }]);
    render(<ProtectedRoute />);

    const navigateElement = screen.queryByTestId("navigate");
    expect(navigateElement).toHaveAttribute("data-to", "/auth");
  });

  it("renders Outlet when authenticated", () => {
    mockUseAuthState.mockReturnValue([{}, false, undefined]);
    render(<ProtectedRoute />);

    expect(screen.queryByTestId("outlet")).toBeInTheDocument();
  });
});
