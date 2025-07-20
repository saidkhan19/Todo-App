import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import useNotificationStore from "@/store/useNotificationStore";
import Notifications from "./Notifications";

vi.mock("@/store/useNotificationStore", async () => ({
  default: vi.fn(),
}));

vi.mock("./components/NotificationItem", async () => {
  const mockNotificationItem = ({ type, message }) => (
    <li data-type={type} data-message={message} />
  );

  return {
    default: mockNotificationItem,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Notifications", async () => {
  const mockUseNotificationStore = vi.mocked(useNotificationStore);

  it("renders empty list when there are no notifications", () => {
    mockUseNotificationStore.mockReturnValue([]);
    render(<Notifications />);

    const list = screen.queryByRole("region", { name: "Уведомления" });
    expect(list).toBeInTheDocument();
    expect(list).toBeEmptyDOMElement();
  });

  it("renders provided notification items", () => {
    const mockNotifications = [
      { id: "1", type: "success", message: "Success message" },
      { id: "2", type: "error", message: "Error message" },
    ];

    mockUseNotificationStore.mockReturnValue(mockNotifications);
    render(<Notifications />);

    const listItems = screen.queryAllByRole("listitem");
    expect(listItems).toHaveLength(2);

    listItems.forEach((el, index) => {
      expect(el.dataset.type).toBe(mockNotifications[index].type);
      expect(el.dataset.message).toBe(mockNotifications[index].message);
    });
  });
});
