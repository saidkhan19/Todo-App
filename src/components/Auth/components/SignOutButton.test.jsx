import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useContext } from "react";

import SignOutButton from "./SignOutButton";

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  return {
    ...mod,
    useContext: vi.fn(),
  };
});

vi.mock("/src/lib/Modal/Modal", () => {
  const mockModal = ({ isOpen, onClose, children }) => (
    <div data-testid="modal" data-is-open={isOpen}>
      <button onClick={onClose} data-testid="onCloseButton" />
      {children}
    </div>
  );

  const mockModalHeading = ({ children }) => <p>{children}</p>;
  const mockModalText = ({ children }) => <p>{children}</p>;
  const mockModalButtonGroup = ({ children }) => <p>{children}</p>;

  return {
    ModalHeading: mockModalHeading,
    ModalText: mockModalText,
    ModalButtonGroup: mockModalButtonGroup,
    default: mockModal,
  };
});

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("AuthPage SignOut", () => {
  const mockUseContext = vi.mocked(useContext);
  const mockHandleSignOut = vi.fn();

  it("disables the button when isLoading is true", () => {
    mockUseContext.mockReturnValue({
      isLoading: true,
      handleSignOut: mockHandleSignOut,
    });
    render(<SignOutButton />);

    const button = screen.getByRole("button", {
      name: "Выйти из временного аккаунта",
    });
    expect(button).toBeDisabled();
  });

  it("renders modal closed initially", () => {
    mockUseContext.mockReturnValue({
      isLoading: false,
      handleSignOut: mockHandleSignOut,
    });
    render(<SignOutButton />);

    const button = screen.getByRole("button", {
      name: "Выйти из временного аккаунта",
    });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("modal")).toHaveAttribute(
      "data-is-open",
      "false"
    );
  });

  it("opens the modal when Sign Out button is clicked", () => {
    mockUseContext.mockReturnValue({
      isLoading: false,
      handleSignOut: mockHandleSignOut,
    });
    render(<SignOutButton />);

    const button = screen.getByRole("button", {
      name: "Выйти из временного аккаунта",
    });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("modal")).toHaveAttribute(
      "data-is-open",
      "false"
    );

    fireEvent.click(button);

    expect(screen.getByTestId("modal")).toHaveAttribute("data-is-open", "true");
  });

  it("cancels sign out when cancel button is clicked", () => {
    mockUseContext.mockReturnValue({
      isLoading: false,
      handleSignOut: mockHandleSignOut,
    });
    render(<SignOutButton />);

    const button = screen.getByRole("button", {
      name: "Выйти из временного аккаунта",
    });
    fireEvent.click(button);
    expect(screen.getByTestId("modal")).toHaveAttribute("data-is-open", "true");

    const cancelButton = screen.getByRole("button", { name: "Отмена" });
    fireEvent.click(cancelButton);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("modal")).toHaveAttribute(
      "data-is-open",
      "false"
    );
  });

  it("cancels sign out when cancel function called from the modal", () => {
    mockUseContext.mockReturnValue({
      isLoading: false,
      handleSignOut: mockHandleSignOut,
    });
    render(<SignOutButton />);

    const button = screen.getByRole("button", {
      name: "Выйти из временного аккаунта",
    });
    fireEvent.click(button);
    expect(screen.getByTestId("modal")).toHaveAttribute("data-is-open", "true");

    const cancelButton = screen.getByTestId("onCloseButton");
    fireEvent.click(cancelButton);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("modal")).toHaveAttribute(
      "data-is-open",
      "false"
    );
  });

  it("handles sign out process when Sign Out button is clicked", () => {
    mockUseContext.mockReturnValue({
      isLoading: false,
      handleSignOut: mockHandleSignOut,
    });
    render(<SignOutButton />);

    const button = screen.getByRole("button", {
      name: "Выйти из временного аккаунта",
    });
    fireEvent.click(button);
    expect(screen.getByTestId("modal")).toHaveAttribute("data-is-open", "true");

    const signOutButton = screen.getByRole("button", { name: "Выйти" });
    fireEvent.click(signOutButton);

    // Should call signout method
    expect(mockHandleSignOut).toHaveBeenCalled();

    // Should close the modal
    expect(screen.getByTestId("modal")).toHaveAttribute(
      "data-is-open",
      "false"
    );
  });
});
