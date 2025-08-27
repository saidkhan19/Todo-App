import ItemForm from "../ItemForm/ItemForm";
import { useUpdateItem } from "@/hooks/queries";

const UpdateTaskModal = ({ modalState, item }) => {
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
