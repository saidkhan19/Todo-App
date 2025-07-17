import { Calendar as CalendarIcon } from "lucide-react";

import styles from "./CalendarPopup.module.scss";
import Menu from "@/lib/Menu";
import Calendar from "@/lib/Calendar";
import DateDisplay from "@/components/shared/DateDisplay";

const CalendarPopup = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}) => {
  return (
    <Menu
      title="Назначьте сроки"
      renderOpener={(props) => (
        <div
          {...props}
          role="combobox"
          tabIndex="0"
          title="Назначьте сроки"
          className={styles["calendar-trigger"]}
        >
          <CalendarIcon size={16} stroke="currentColor" />
          <DateDisplay startDate={startDate} endDate={endDate} />
        </div>
      )}
      renderContent={() => (
        <Calendar
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={onChangeStartDate}
          onChangeEndDate={onChangeEndDate}
        />
      )}
    />
  );
};

export default CalendarPopup;
