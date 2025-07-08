import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { addDoc } from "firebase/firestore";
import AddProjectButton from "./AddProjectButton";
import useNotificationStore from "@/store/useNotificationStore";
import { FirebaseError } from "firebase/app";

vi.mock("@/config/firebase", async () => {
  const mod = await vi.importActual("@/config/firebase");
  return {
    ...mod,
    auth: { currentUser: { uid: "user-id" } },
  };
});

vi.mock("firebase/firestore", async () => {
  const mod = await vi.importActual("firebase/firestore");
  return {
    ...mod,
    addDoc: vi.fn(),
  };
});

vi.mock("@/store/useNotificationStore", () => {
  const mockedNotify = vi.fn();

  return {
    default: () => mockedNotify,
  };
});

const mockFormData = {
  projectStartDate: "start-date",
  projectEndDate: "end-date",
  projectIcon: "project-icon",
  projectName: "project-name",
  projectPalette: "project-palette",
};

vi.mock("../shared/ProjectForm/ProjectForm", () => ({
  default: ({ isOpen, onCancel, onSave }) => (
    <div data-testid="project-form" data-is-open={isOpen}>
      <button data-testid="cancel" type="button" onClick={onCancel} />
      <button
        data-testid="save"
        type="button"
        onClick={() => onSave(mockFormData)}
      />
    </div>
  ),
}));

afterEach(() => {
  vi.mocked(addDoc).mockReset();
  vi.clearAllMocks();
});

describe("AddProjectButton", () => {
  const mockAddDoc = vi.mocked(addDoc);
  const mockNotify = vi.mocked(useNotificationStore());

  it("renders ProjectForm when 'add' button is clicked", async () => {
    const user = userEvent.setup();

    render(<AddProjectButton />);
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Добавить" }));

    expect(screen.queryByTestId("project-form")).toBeInTheDocument();
  });

  it("hides ProjectForm when 'cancel' button is clicked", async () => {
    const user = userEvent.setup();

    render(<AddProjectButton />);

    await user.click(screen.getByRole("button", { name: "Добавить" }));
    expect(screen.queryByTestId("project-form")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel"));
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();
  });

  it("passes correct data to 'addDoc' when saved & closes the modal", async () => {
    render(<AddProjectButton />);

    fireEvent.click(screen.getByRole("button", { name: "Добавить" }));
    fireEvent.click(screen.getByTestId("save"));

    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        type: "project",
        deleted: false,
        startDate: mockFormData.projectStartDate,
        endDate: mockFormData.projectEndDate,
        icon: mockFormData.projectIcon,
        name: mockFormData.projectName,
        palette: mockFormData.projectPalette,
      })
    );
    expect(screen.queryByTestId("project-form")).not.toBeInTheDocument();
  });

  it("handles FirebaseError correctly", async () => {
    mockAddDoc.mockImplementation(() => {
      throw new FirebaseError("error");
    });

    render(<AddProjectButton />);

    fireEvent.click(screen.getByRole("button", { name: "Добавить" }));

    expect(mockNotify).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("save"));

    expect(mockNotify).toHaveBeenCalled();
  });
});
