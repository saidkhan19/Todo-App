import { parseLocalDateString } from "../utils";

const useCalendarInteraction = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  alignView,
}) => {
  const handleDateClick = (e) => {
    const dateCell = e.target.closest("[data-date]");
    if (!dateCell) return;
    const dateString = dateCell.dataset.date;
    const date = parseLocalDateString(dateString);

    // Change the view of the calendar, if we selected outside the current month
    alignView(date);

    // Expand the range if date is outside the range
    if (date < startDate) {
      onChangeStartDate(date);
    } else if (date > endDate) {
      onChangeEndDate(date);
    }

    // Narrow the range to the single date, if selected within the current range
    if (date > startDate && date < endDate) {
      onChangeStartDate(date);
      onChangeEndDate(date);
    }
  };

  // Handle keyboard selection
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDateClick(e);
    }
  };

  return { handleDateClick, handleKeyDown };
};

export default useCalendarInteraction;
