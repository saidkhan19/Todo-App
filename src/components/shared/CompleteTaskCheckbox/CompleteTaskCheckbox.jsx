import { updateItem } from "@/utils/firebase";
import Checkbox from "@/components/UI/Checkbox";
import useNotificationStore from "@/store/useNotificationStore";

const CompleteTaskCheckbox = ({ item }) => {
  const isChecked = item.completed;
  const notify = useNotificationStore((state) => state.notify);

  const handleChange = async (e) => {
    const value = e.target.checked;

    await updateItem(item.id, { completed: value }, notify);
  };

  return (
    <Checkbox
      label={isChecked ? "Отметить незавершённым" : "Отметить завершённым"}
      checked={isChecked}
      onChange={handleChange}
    />
  );
};

export default CompleteTaskCheckbox;
