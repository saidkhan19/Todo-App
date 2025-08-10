import { ChevronDown, ChevronUp } from "lucide-react";

import styles from "./ItemCard.module.scss";
import Button from "@/components/UI/Button";

const ExpandButton = ({ isExpanded, ...props }) => {
  return (
    <Button variant="plain" className={styles["expand-button"]} {...props}>
      {isExpanded ? (
        <ChevronDown size={22} stroke="currentColor" strokeWidth={1} />
      ) : (
        <ChevronUp size={22} stroke="currentColor" strokeWidth={1} />
      )}
    </Button>
  );
};

export default ExpandButton;
