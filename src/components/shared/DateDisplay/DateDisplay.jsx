import { formatDate } from "@/utils/format";

const DateDisplay = ({ startDate, endDate, className, ...props }) => {
  if (startDate.getTime() === endDate.getTime())
    return (
      <p className={className} {...props}>
        {formatDate(startDate)}
      </p>
    );

  return (
    <p className={className} {...props}>
      {formatDate(startDate)}-{formatDate(endDate)}
    </p>
  );
};

export default DateDisplay;
