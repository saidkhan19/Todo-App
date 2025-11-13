import { Calendar as CalendarIcon } from "lucide-react";

import styles from "./CalendarPopup.module.scss";
import Menu from "@/lib/Menu";
import Calendar from "@/lib/Calendar";
import DateDisplay from "@/components/shared/DateDisplay";
import { useTranslation } from "react-i18next";

const CalendarPopup = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}) => {
  const { t } = useTranslation("common");

  return (
    <Menu
      title={t("labels.setDeadline")}
      renderOpener={(props) => (
        <div
          {...props}
          role="combobox"
          tabIndex="0"
          title={t("labels.setDeadline")}
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
