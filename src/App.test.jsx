import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet } from "react-router";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

// Mock BrowserRouter to avoid actual navigation
vi.mock("react-router", async () => {
  const mod = await vi.importActual("react-router");
  const mockBrowserRouter = ({ children }) => <div>{children}</div>;
  return {
    ...mod,
    BrowserRouter: mockBrowserRouter,
  };
});

// Mock Notifications
vi.mock("./components/Notifications", () => ({
  default: () => <div data-testid="Notifications" />,
}));

// Mock ProtectedRoute
vi.mock("./components/ProtectedRoute", () => ({
  default: () => (
    <div data-testid="ProtectedRoute">
      <Outlet />
    </div>
  ),
}));

// Mock Layout
vi.mock("./layout/Layout", () => ({
  default: () => (
    <div data-testid="Layout">
      <Outlet />
    </div>
  ),
}));

// Mock Auth
vi.mock("./components/Auth", () => ({
  default: () => <div data-testid="Auth" />,
}));

// Mock Home
vi.mock("./components/Home", () => ({
  default: () => <div data-testid="Home" />,
}));

// Mock Projects
vi.mock("./components/Projects", () => ({
  default: () => <div data-testid="Projects" />,
}));

// Mock Tasks
vi.mock("./components/Tasks", () => ({
  default: () => <div data-testid="Tasks" />,
}));

// Mock Profile
vi.mock("./components/Profile", () => ({
  default: () => <div data-testid="Profile" />,
}));

// Mock NotFound
vi.mock("./components/NotFound", () => ({
  default: () => <div data-testid="NotFound" />,
}));

// Mock ErrorBoundary
vi.mock("./components/ErrorBoundary/ErrorBoundary", () => ({
  default: ({ children }) => <div data-testid="ErrorBoundary">{children}</div>,
}));

describe("App", () => {
  it("renders Notification component", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Notifications")).toBeInTheDocument();
  });

  it("renders Auth component on /auth route", () => {
    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Auth")).toBeInTheDocument();
  });

  it("renders Home component on / route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Home")).toBeInTheDocument();
    expect(screen.getByTestId("Layout")).toBeInTheDocument();
    expect(screen.getByTestId("ProtectedRoute")).toBeInTheDocument();
  });

  it("renders Projects component on /projects route", () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Projects")).toBeInTheDocument();
  });

  it("renders Tasks component on /tasks route", () => {
    render(
      <MemoryRouter initialEntries={["/tasks"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Tasks")).toBeInTheDocument();
  });

  it("renders Profile component on /profile route", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Profile")).toBeInTheDocument();
  });

  it("renders NotFound component on unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("NotFound")).toBeInTheDocument();
  });

  it("wraps everything in ErrorBoundary", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ErrorBoundary")).toBeInTheDocument();
  });
});
