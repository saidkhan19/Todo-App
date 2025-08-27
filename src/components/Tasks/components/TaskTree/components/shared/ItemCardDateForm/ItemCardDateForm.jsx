import { useEffect, useLayoutEffect, useState } from "react";

import styles from "./ItemCardDateForm.module.scss";
import { useUpdateItem } from "@/hooks/queries";
import CalendarPopup from "@/lib/CalendarPopup";

const ItemCardDateForm = ({ itemId, defaultStartDate, defaultEndDate }) => {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const updateItem = useUpdateItem();

  useLayoutEffect(() => {
    // Sync defaults with new values from the props
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

      await updateItem(itemId, { startDate, endDate });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    startDate,
    endDate,
    defaultStartDate,
    defaultEndDate,
    itemId,
    updateItem,
  ]);

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
