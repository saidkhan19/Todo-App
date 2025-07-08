import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useContext } from "react";

import AuthPage from "./AuthPage";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  return {
    ...mod,
    useContext: vi.fn(),
  };
});

vi.mock("./SignInWithGoogleButton", async () => ({
  default: () => <div data-testid="sign-in-with-google" />,
}));

vi.mock("./SignInAnonymouslyButton", async () => ({
  default: () => <div data-testid="sign-in-anonymously" />,
}));

vi.mock("./SignOutButton", async () => ({
  default: () => <div data-testid="sign-out" />,
}));

vi.mock("@/components/UI/SpinnerBox", async () => ({
  default: () => <div data-testid="spinner-box" />,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("AuthPage", () => {
  const mockUseContext = vi.mocked(useContext);

  it("shows loading spinner when isLoading is true", () => {
    mockUseContext.mockReturnValue({ isLoading: true, user: null });
    render(<AuthPage />);
    expect(screen.getByTestId("spinner-box")).toBeInTheDocument();
  });

  it("renders sign-in buttons when user is not authenticated", () => {
    mockUseContext.mockReturnValue({ isLoading: false, user: null });
    render(<AuthPage />);
    expect(screen.getByTestId("sign-in-with-google")).toBeInTheDocument();
    expect(screen.getByTestId("sign-in-anonymously")).toBeInTheDocument();
    expect(screen.queryByTestId("sign-out")).not.toBeInTheDocument();
  });

  it("renders sign-out button when user is anonymous", () => {
    mockUseContext.mockReturnValue({
      isLoading: false,
      user: { isAnonymous: true },
    });
    render(<AuthPage />);
    expect(screen.getByTestId("sign-out")).toBeInTheDocument();
  });

  it("does not render sign-out button when user is not anonymous", () => {
    mockUseContext.mockReturnValue({
      isLoading: false,
      user: { isAnonymous: false },
    });
    render(<AuthPage />);
    expect(screen.queryByTestId("sign-out")).not.toBeInTheDocument();
  });

  it("renders logo and title", () => {
    mockUseContext.mockReturnValue({ isLoading: false, user: null });
    render(<AuthPage />);
    expect(screen.getByText("Задачник")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("sr-only");
  });
});
