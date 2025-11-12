import { memo } from "react";
import { motion as Motion, stagger } from "motion/react";

import styles from "./TaskGroup.module.scss";
import ItemCard from "../ItemCard/ItemCard";

const TaskGroup = memo(({ items }) => {
  return (
    <Motion.div
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: stagger(0.06) },
        },
      }}
      initial="hidden"
      animate="visible"
      className={styles["task-group"]}
    >
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </Motion.div>
  );
});

export default TaskGroup;
