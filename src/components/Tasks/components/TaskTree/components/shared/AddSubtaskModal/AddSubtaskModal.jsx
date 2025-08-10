import { saveItem } from "@/utils/firebase";
import useNotificationStore from "@/store/useNotificationStore";
import ItemForm from "../ItemForm/ItemForm";

const AddSubtaskModal = ({ modalState, item }) => {
  const notify = useNotificationStore((state) => state.notify);

  const handleSave = async (data) => {
    modalState.close();

    await saveItem(
      {
        type: "task",
        level: item.level + 1,
        parentId: item.id,
        text: data.text,
        startDate: data.startDate,
        endDate: data.endDate,
      },
      notify
    );
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
