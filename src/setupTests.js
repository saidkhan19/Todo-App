import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-i18next completely
vi.mock("react-i18next", async () => {
  const actual = await vi.importActual("react-i18next");
  const mockChangeLanguage = vi.fn();

  return {
    ...actual,
    useTranslation: () => ({
      t: (key) => key,
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: "en",
        resolvedLanguage: "en",
      },
    }),
    Trans: ({ children }) => children,
    initReactI18next: {
      type: "3rdParty",
      init: () => {},
    },
  };
});

vi.mock("@/config/i18n", async () => ({
  default: {
    exists: () => true,
    t: (key) => key,
  },
}));

afterEach(() => {
  cleanup();
});
