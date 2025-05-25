import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { useNavigate } from "react-router";

import useNotificationStore from "../../../store/useNotificationStore";
import SignInAnonymouslyButton from "./SignInAnonymouslyButton";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  return {
    ...mod,
    useContext: vi.fn(),
  };
});

vi.mock("react-router", () => {
  // Maintain the same reference to the navigateMock
  const navigateMock = vi.fn();
  return {
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../store/useNotificationStore", () => ({
  default: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("SignInAnonymously", () => {
  const mockUseContext = vi.mocked(useContext);
  const mockNavigate = vi.mocked(useNavigate());
  const mockStore = vi.mocked(useNotificationStore);
  const mockHandleRegister = vi.fn();

  it("disables the button when isLoading is true", () => {
    mockUseContext.mockReturnValue({
      isLoading: true,
      handleRegisterWithGoogle: mockHandleRegister,
    });
    render(<SignInAnonymouslyButton />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("navigates and notifies when sign in happens successfully", async () => {
    mockHandleRegister.mockReturnValue({});
    mockUseContext.mockReturnValue({
      isLoading: false,
      handleSignInAnonymously: mockHandleRegister,
    });

    const mockNotify = vi.fn();
    mockStore.mockReturnValue(mockNotify);
    render(<SignInAnonymouslyButton />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
      expect(mockNotify).toHaveBeenCalled();
    });
  });
});
