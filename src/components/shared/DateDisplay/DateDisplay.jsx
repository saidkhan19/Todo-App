import { formatDate } from "@/utils/format";

const DateDisplay = ({ startDate, endDate, className }) => {
  if (startDate.getTime() === endDate.getTime())
    return <p className={className}>{formatDate(startDate)}</p>;

  return (
    <p className={className}>
      {formatDate(startDate)}-{formatDate(endDate)}
    </p>
  );
};

export default DateDisplay;
