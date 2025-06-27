import Menu from "@/lib/Menu";
import Calendar from "@/lib/Calendar";

const CalendarPopup = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}) => {
  return (
    <Menu
      title="Выберите дату"
      renderOpener={(props) => <div {...props}>open </div>}
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
