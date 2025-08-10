import useNotificationStore from "@/store/useNotificationStore";
import { updateItem } from "@/utils/firebase";

export const useDeleteTask = (taskId) => {
  const notify = useNotificationStore((state) => state.notify);

  const handleDeleteTask = async () => {
    await updateItem(taskId, { deleted: true }, notify);
  };

  return handleDeleteTask;
};
