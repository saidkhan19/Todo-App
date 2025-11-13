import { useTranslation } from "react-i18next";

import { useUpdateItem } from "@/hooks/queries";
import ItemForm from "../ItemForm/ItemForm";

const UpdateTaskModal = ({ modalState, item }) => {
  const { t } = useTranslation("tasks");
  const updateItem = useUpdateItem();

  const handleSave = async (data) => {
    modalState.close();

    await updateItem(item.id, {
      text: data.text,
      startDate: data.startDate,
      endDate: data.endDate,
    });
  };

  return (
    modalState.isOpen && (
      <ItemForm
        isOpen={modalState.isOpen}
        onCancel={modalState.close}
        title={t("editTaskFormTitle")}
        defaultText={item.text}
        defaultStartDate={item.startDate}
        defaultEndDate={item.endDate}
        onSave={handleSave}
      />
    )
  );
};
export default UpdateTaskModal;
