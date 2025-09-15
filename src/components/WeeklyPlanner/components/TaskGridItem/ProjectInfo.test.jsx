import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { useMergeRefs } from "@floating-ui/react";
import { useDefaultProjectContext } from "@/components/DataProviders/DefaultProjectProvider";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getRootProject } from "@/utils/dataTransforms";
import { mockStoreState } from "@/utils/test-utils";
import { usePlannerStore } from "../../store";
import ProjectInfo from "./ProjectInfo";

vi.mock("@/components/DataProviders/ProjectsAndTasksProvider", () => ({
  useProjectsAndTasksContext: vi.fn(),
}));

vi.mock("@/components/DataProviders/DefaultProjectProvider", () => ({
  useDefaultProjectContext: vi.fn(),
}));

vi.mock("../../store", () => ({
  usePlannerStore: vi.fn(),
}));

vi.mock("@floating-ui/react", {
  useMergeRefs: vi.fn(),
});

vi.mock("@/utils/dataTransforms", () => ({
  getRootProject: vi.fn(),
}));

vi.mock("@/components/shared/ProjectSymbol", () => ({
  default: (props) => (
    <div
      data-testid="project-symbol"
      data-palette-id={props.paletteId}
      data-icon-id={props.iconId}
      data-checked={props.checked}
    />
  ),
}));

// Mock useRef
const mockRef = { current: null };
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useRef: vi.fn(() => mockRef),
  };
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

beforeEach(() => {
  vi.clearAllTimers();
  vi.useFakeTimers();
});

describe("ProjectInfo", () => {
  const mockItem = {
    id: "item-123",
    name: "Test Item",
    completed: false,
    projectId: "project-456",
  };

  const mockProject = {
    id: "project-456",
    name: "Test Project",
    palette: "blue",
    icon: "folder",
  };

  const mockDefaultProject = {
    id: "default-project",
    name: "Default Project",
    palette: "gray",
    icon: "inbox",
  };

  const mockSetFocusedItem = vi.fn();
  const mockOnFocus = vi.fn();
  const mockMergedRef = vi.fn();

  const defaultMockProps = {
    item: mockItem,
    onFocus: mockOnFocus,
    "data-testid": "project-info",
  };

  const mockUseProjectsAndTasksContext = vi.mocked(useProjectsAndTasksContext);
  const mockUseDefaultProjectContext = vi.mocked(useDefaultProjectContext);
  const mockUseMergeRefs = vi.mocked(useMergeRefs);
  const mockGetRootProject = vi.mocked(getRootProject);

  beforeEach(() => {
    // Reset mock ref
    mockRef.current = { focus: vi.fn() };

    mockUseProjectsAndTasksContext.mockReturnValue({ items: [mockItem] });
    mockUseDefaultProjectContext.mockReturnValue({
      defaultProject: mockDefaultProject,
    });

    mockStoreState(usePlannerStore, {
      setFocusedItem: mockSetFocusedItem,
      focusedItem: null,
    });

    mockUseMergeRefs.mockReturnValue(mockMergedRef);
    mockGetRootProject.mockReturnValue(mockProject);
  });

  it("renders nothing when items is null", () => {
    mockUseProjectsAndTasksContext.mockReturnValue({ items: null });

    const { container } = render(<ProjectInfo {...defaultMockProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when defaultItem is null", () => {
    mockUseDefaultProjectContext.mockReturnValue({ defaultProject: null });

    const { container } = render(<ProjectInfo {...defaultMockProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the component when all dependencies exist", () => {
    render(<ProjectInfo {...defaultMockProps} />);

    expect(screen.getByTestId("project-info")).toBeInTheDocument();
    expect(screen.getByTestId("project-symbol")).toBeInTheDocument();
  });

  it("calls getRootProject with correct arguments", () => {
    render(<ProjectInfo {...defaultMockProps} />);

    expect(mockGetRootProject).toHaveBeenCalledWith(
      defaultMockProps.item,
      [mockItem],
      mockDefaultProject
    );
  });

  it("passes project data to ProjectSymbol", () => {
    render(<ProjectInfo {...defaultMockProps} />);

    const projectSymbol = screen.getByTestId("project-symbol");

    expect(projectSymbol.dataset.paletteId).toBe(mockProject.palette);
    expect(projectSymbol.dataset.iconId).toBe(mockProject.icon);
    expect(projectSymbol.dataset.checked).toBe(
      String(defaultMockProps.item.completed)
    );
  });

  it("calls useMergeRefs with correct refs", () => {
    const externalRef = vi.fn();
    render(<ProjectInfo {...defaultMockProps} ref={externalRef} />);

    expect(mockUseMergeRefs).toHaveBeenCalledWith([mockRef, externalRef]);
  });

  it("calls setFocusedItem & Floating UI's onFocus when focused", () => {
    render(<ProjectInfo {...defaultMockProps} />);

    expect(mockSetFocusedItem).not.toHaveBeenCalled();
    expect(mockOnFocus).not.toHaveBeenCalled();

    fireEvent.focus(screen.getByTestId("project-info"));

    expect(mockSetFocusedItem).toHaveBeenCalled();
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it("auto-focuses in 400ms when the item is focused in the store", () => {
    mockStoreState(usePlannerStore, {
      setFocusedItem: mockSetFocusedItem,
      focusedItem: defaultMockProps.item,
    });

    render(<ProjectInfo {...defaultMockProps} />);

    expect(screen.getByTestId("project-info")).not.toHaveFocus();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(mockRef.current.focus).toHaveBeenCalled();
  });

  it("does not auto-focus when the item is not focused", () => {
    mockStoreState(usePlannerStore, {
      setFocusedItem: mockSetFocusedItem,
      focusedItem: { id: "different-item" },
    });

    render(<ProjectInfo {...defaultMockProps} />);

    expect(screen.getByTestId("project-info")).not.toHaveFocus();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(mockRef.current.focus).not.toHaveBeenCalled();
  });

  it("cleans up the focus timeout on component unmount", () => {
    mockStoreState(usePlannerStore, {
      setFocusedItem: mockSetFocusedItem,
      focusedItem: defaultMockProps.item,
    });

    vi.spyOn(window, "clearTimeout");

    const { unmount } = render(<ProjectInfo {...defaultMockProps} />);
    unmount();

    expect(window.clearTimeout).toHaveBeenCalled();
  });
});
