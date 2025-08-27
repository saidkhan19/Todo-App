import { useSaveItem } from "@/hooks/queries";
import ItemForm from "../ItemForm/ItemForm";

const AddSubtaskModal = ({ modalState, item }) => {
  const saveItem = useSaveItem();

  const handleSave = async (data) => {
    modalState.close();

    await saveItem({
      type: "task",
      level: item.level + 1,
      parentId: item.id,
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
        title="Добавить подзадачу"
        onSave={handleSave}
      />
    )
  );
};

export default AddSubtaskModal;
