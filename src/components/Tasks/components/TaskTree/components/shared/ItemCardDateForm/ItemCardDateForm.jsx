import { useEffect, useLayoutEffect, useState } from "react";

import styles from "./ItemCardDateForm.module.scss";
import { updateItem } from "@/utils/firebase";
import CalendarPopup from "@/lib/CalendarPopup";
import useNotificationStore from "@/store/useNotificationStore";

const ItemCardDateForm = ({ itemId, defaultStartDate, defaultEndDate }) => {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const notify = useNotificationStore((state) => state.notify);

  useLayoutEffect(() => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  }, [defaultStartDate, defaultEndDate]);

  useEffect(() => {
    // Debounce updates, user might drag select
    const timeoutId = setTimeout(async () => {
      // Send update request only when state has changed
      if (
        startDate.getTime() === defaultStartDate.getTime() &&
        endDate.getTime() === defaultEndDate.getTime()
      )
        return;

      await updateItem(itemId, { startDate, endDate }, notify);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [startDate, endDate, defaultStartDate, defaultEndDate, itemId, notify]);

  return (
    <div className={styles["date-form"]}>
      <CalendarPopup
        startDate={startDate}
        endDate={endDate}
        onChangeStartDate={setStartDate}
        onChangeEndDate={setEndDate}
      />
    </div>
  );
};

export default ItemCardDateForm;
