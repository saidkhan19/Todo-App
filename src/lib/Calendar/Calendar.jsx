import Menu from "@/lib/Menu";

const Calendar = ({
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
        <div>
          <input
            type="date"
            id="start-date"
            value={startDate}
            hidden
            aria-hidden="true"
            name="start-date"
            readOnly
          />
          <input
            type="date"
            id="end-date"
            value={endDate}
            hidden
            aria-hidden="true"
            name="end-date"
            readOnly
          />
          hi
        </div>
      )}
    />
  );
};

export default Calendar;
