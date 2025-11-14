import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { useSignOut } from "react-firebase-hooks/auth";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import useUserDetails from "../../hooks/useUserDetails";
import Account from "./Account";

vi.mock("@/config/firebase", async () => ({
  auth: {},
}));

vi.mock("react-firebase-hooks/auth", async () => ({
  useSignOut: vi.fn(),
}));

vi.mock("../../hooks/useUserDetails", async () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/useFirebaseErrorNotification", async () => ({
  default: vi.fn(),
}));

vi.mock("../LanguageSelect/LanguageSelect", async () => ({
  default: () => <div data-testid="language-select" />,
}));

const mockSignOut = vi.mocked(useSignOut);
const mockUseUserDetails = vi.mocked(useUserDetails);
const mockUseFirebaseErrorNotification = vi.mocked(
  useFirebaseErrorNotification
);

const mockUserDetails = {
  photoURL: "/mock-path.jpg",
  name: "John",
  email: "john@email.com",
};

const mockSignOutHandler = vi.fn();
const mockError = {};

beforeEach(() => {
  mockSignOut.mockReturnValue([mockSignOutHandler, false, mockError]);
  mockUseUserDetails.mockReturnValue(mockUserDetails);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Account", () => {
  it("renders all user details", () => {
    render(<Account />);

    expect(screen.queryByRole("img")).toHaveAttribute(
      "src",
      mockUserDetails.photoURL
    );
    expect(screen.queryByText(mockUserDetails.name)).toBeInTheDocument();
    expect(screen.queryByText(mockUserDetails.email)).toBeInTheDocument();
  });

  it("calls sign out handler when sign out button is clicked", () => {
    render(<Account />);

    expect(mockSignOutHandler).not.toHaveBeenCalled();

    fireEvent.click(
      screen.queryByRole("button", { name: "common:controls.signOut" })
    );

    expect(mockSignOutHandler).toHaveBeenCalled();
  });

  it("calls useFirebaseErrorNotification with the error object", () => {
    render(<Account />);
    expect(mockUseFirebaseErrorNotification).toHaveBeenCalledWith(mockError);
  });
});
