import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./LanguageSelect";

vi.mock("@/lib/Menu", async () => ({
  default: ({ title, renderOpener, renderContent }) => (
    <div>
      <div data-testid="title">{title}</div>
      <div data-testid="opener">{renderOpener()}</div>
      <div data-testid="content">{renderContent(vi.fn())}</div>
    </div>
  ),
}));

vi.mock("@/lib/SelectMenu", async () => ({
  default: ({ options, selected, onChange }) => (
    <div>
      <div data-testid="selected" data-selected={selected} />
      <div data-testid="options" role="listbox">
        {options.map((item) => (
          <li
            key={item.value}
            role="option"
            data-value={item.value}
            data-name={item.name}
          />
        ))}
      </div>
      <button
        data-testid="change-language-to-ru"
        onClick={() => onChange("ru")}
      />
    </div>
  ),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("LanguageSelect", () => {
  const mockChangeLanguage = vi.mocked(useTranslation().i18n.changeLanguage);

  it("correctly renders the opener", () => {
    render(<LanguageSelect />);

    const opener = screen.getByRole("combobox");
    expect(opener).toHaveTextContent("English");
  });

  it("renders SelectMenu with the correct format of options", () => {
    render(<LanguageSelect />);
    const options = screen.getAllByRole("option");

    expect(options[0]).toHaveAttribute("data-value", "en");
    expect(options[0]).toHaveAttribute("data-name", "English");
    expect(options[1]).toHaveAttribute("data-value", "ru");
    expect(options[1]).toHaveAttribute("data-name", "Русский");
  });

  it("passes correct selected prop to the SelectMenu", () => {
    render(<LanguageSelect />);

    expect(screen.getByTestId("selected")).toHaveAttribute(
      "data-selected",
      "en"
    );
  });

  it("calls changeLanguage with correct arguments", () => {
    render(<LanguageSelect />);

    fireEvent.click(screen.getByTestId("change-language-to-ru"));

    expect(mockChangeLanguage).toHaveBeenCalledWith("ru");
  });
});
