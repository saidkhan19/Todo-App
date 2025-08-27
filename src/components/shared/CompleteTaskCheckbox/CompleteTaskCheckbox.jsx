import { useUpdateItem } from "@/hooks/queries";
import Checkbox from "@/components/UI/Checkbox";

const CompleteTaskCheckbox = ({ item }) => {
  const isChecked = item.completed;

  const updateItem = useUpdateItem();

  const handleChange = async (e) => {
    const value = e.target.checked;

    await updateItem(item.id, { completed: value });
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
