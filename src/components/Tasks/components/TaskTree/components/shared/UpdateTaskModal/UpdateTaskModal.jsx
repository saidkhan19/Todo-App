import { updateItem } from "@/utils/firebase";
import useNotificationStore from "@/store/useNotificationStore";
import ItemForm from "../ItemForm/ItemForm";

const UpdateTaskModal = ({ modalState, item }) => {
  const notify = useNotificationStore((state) => state.notify);

  const handleSave = async (data) => {
    modalState.close();

    await updateItem(
      item.id,
      { text: data.text, startDate: data.startDate, endDate: data.endDate },
      notify
    );
  };

  return (
    modalState.isOpen && (
      <ItemForm
        isOpen={modalState.isOpen}
        onCancel={modalState.close}
        title="Изменить задачу"
        defaultText={item.text}
        defaultStartDate={item.startDate}
        defaultEndDate={item.endDate}
        onSave={handleSave}
      />
    )
  );
};
export default UpdateTaskModal;
