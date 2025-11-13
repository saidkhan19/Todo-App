import { motion as Motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

import styles from "./ItemCard.module.scss";
import Button from "@/components/UI/Button";

const ExpandButton = ({ isExpanded, ...props }) => {
  const { t } = useTranslation("tasks");
  const title = isExpanded ? t("controls.collapse") : t("controls.expand");

  return (
    <Motion.div
      animate={{
        rotate: isExpanded ? 180 : 0,
      }}
      className={`flex-center ${styles["expand-button-container"]}`}
    >
      <Button
        variant="plain"
        className={styles["expand-button"]}
        title={title}
        {...props}
      >
        <ChevronDown size={16} stroke="currentColor" strokeWidth={1} />
        <span className="sr-only">{title}</span>
      </Button>
    </Motion.div>
  );
};

export default ExpandButton;
