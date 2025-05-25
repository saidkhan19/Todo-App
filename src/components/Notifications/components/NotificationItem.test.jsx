import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotificationItem from "./NotificationItem";

describe("NotificationItem", () => {
  const mockNotifications = [
    { id: "1", type: "success", message: "Success message" },
    { id: "2", type: "warning", message: "Warning message" },
    { id: "3", type: "error", message: "Error message" },
  ];

  it.each(mockNotifications)(
    "renders correct attributes and message for type: $type",
    ({ type, message }) => {
      render(<NotificationItem type={type} message={message} />);

      expect(screen.queryByText(message)).toBeInTheDocument();

      if (type === "success") {
        const item = screen.getByRole("status");
        expect(item).toHaveAttribute("aria-label", "Успешно");
        expect(item).toHaveAttribute("aria-live", "polite");
      } else if (type === "warning") {
        const item = screen.getByRole("alert");
        expect(item).toHaveAttribute("aria-label", "Внимание");
        expect(item).toHaveAttribute("aria-live", "polite");
      } else if (type === "error") {
        const item = screen.getByRole("alert");
        expect(item).toHaveAttribute("aria-label", "Ошибка");
        expect(item).toHaveAttribute("aria-live", "assertive");
      }
    }
  );
});
