import { vi } from "vitest";

export const mockStoreState = (store, state) => {
  vi.mocked(store).mockImplementation((selector) => selector(state));
};
