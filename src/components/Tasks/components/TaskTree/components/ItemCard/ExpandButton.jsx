import { ChevronDown, ChevronUp } from "lucide-react";

import styles from "./ItemCard.module.scss";
import Button from "@/components/UI/Button";

const ExpandButton = ({ isExpanded, ...props }) => {
  const title = isExpanded ? "Сократить" : "Раскрыть";
  return (
    <Button
      variant="plain"
      className={styles["expand-button"]}
      title={title}
      {...props}
    >
      {isExpanded ? (
        <ChevronDown size={18} stroke="currentColor" strokeWidth={1} />
      ) : (
        <ChevronUp size={18} stroke="currentColor" strokeWidth={1} />
      )}
      <span className="sr-only">{title}</span>
    </Button>
  );
};

export default ExpandButton;
