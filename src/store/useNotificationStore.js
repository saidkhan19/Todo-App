import { create } from "zustand";

import { NOTIFICATION_DURATION } from "../config/app";

const useNotificationStore = create((set) => ({
  notifications: [],
  notify: async ({ type, message }) => {
    // Generate id for new notification
    const randomInt = Math.floor(Math.random() * 1000);
    const id = `${type}-${Date.now()}-${randomInt}`;

    const newNotification = { id, type, message };
    // Update notifications
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));

    // Remove the notification when time is up
    setTimeout(
      () =>
        set((state) => ({
          notifications: state.notifications.filter(
            (n) => n.id !== newNotification.id
          ),
        })),
      NOTIFICATION_DURATION
    );
  },
}));

export default useNotificationStore;
