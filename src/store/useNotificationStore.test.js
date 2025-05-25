import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useNotificationStore from "./useNotificationStore";
import { NOTIFICATION_DURATION } from "../config/app";

describe("useNotificationStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useNotificationStore.setState({ notifications: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds notification when notify is called", () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.notify({ type: "success", message: "Test message" });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: "success",
      message: "Test message",
    });
  });

  it("adds multiple notifications correctly", () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.notify({ type: "success", message: "First message" });
    });
    act(() => {
      result.current.notify({ type: "success", message: "Second message" });
    });

    expect(result.current.notifications).toHaveLength(2);
    const n1 = result.current.notifications[0];
    const n2 = result.current.notifications[1];

    // Should add the second message at the beginning
    expect(n1.message).toBe("Second message");
    expect(n2.message).toBe("First message");

    // Should have different ids
    expect(n1.id).not.toBe(n2.id);
  });

  it("removes the notification when time is up", () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.notify({ type: "success", message: "Test message" });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(NOTIFICATION_DURATION);
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});
