import { useTranslation } from "react-i18next";

import styles from "./LanguageSelect.module.scss";
import Menu from "@/lib/Menu";
import SelectMenu from "@/lib/SelectMenu";
import { Languages } from "lucide-react";

const options = [
  { value: "en", name: "English" },
  { value: "ru", name: "Русский" },
];

const LanguageSelect = () => {
  const { i18n } = useTranslation();

  const currentLanguage = options.find(
    (option) => option.value === i18n.resolvedLanguage
  );

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu
      title="Выберите язык"
      renderOpener={(props) => (
        <div
          {...props}
          role="combobox"
          tabIndex="0"
          title="Выберите язык"
          className={styles["select-opener"]}
        >
          <Languages size={19} stroke="currentColor" strokeWidth={1} />
          <span>{currentLanguage.name}</span>
        </div>
      )}
      renderContent={(close) => (
        <SelectMenu
          options={options}
          selected={currentLanguage.value}
          onChange={(lng) => {
            close();
            changeLanguage(lng);
          }}
        />
      )}
    />
  );
};

export default LanguageSelect;
