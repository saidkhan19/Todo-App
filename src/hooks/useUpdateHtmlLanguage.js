import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const useUpdateHtmlLanguage = () => {
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    document.title = t("appTitle");
    document.documentElement.lang = i18n.resolvedLanguage;
  }, [t, i18n.resolvedLanguage]);
};

export default useUpdateHtmlLanguage;
