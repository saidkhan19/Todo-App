import { useUpdateItem } from "@/hooks/queries";
import Checkbox from "@/components/UI/Checkbox";
import { useTranslation } from "react-i18next";

const CompleteTaskCheckbox = ({ item }) => {
  const { t } = useTranslation("common");
  const isChecked = item.completed;

  const updateItem = useUpdateItem();

  const handleChange = async (e) => {
    const value = e.target.checked;

    await updateItem(item.id, { completed: value });
  };

  return (
    <Checkbox
      label={
        isChecked
          ? t("controls.markAsIncomplete")
          : t("controls.markAsComplete")
      }
      checked={isChecked}
      onChange={handleChange}
    />
  );
};

export default CompleteTaskCheckbox;
