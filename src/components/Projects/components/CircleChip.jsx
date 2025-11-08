import { useEffect, useRef } from "react";
import { motion as Motion } from "motion/react";
import { Circle, LoaderCircle } from "lucide-react";

const CircleChip = ({ palette, isLoading, size = 14 }) => {
  const initialRef = useRef(false);

  // Do not run animation on first render
  // Enable it on subsequent renders
  useEffect(() => {
    initialRef.current = true;
  }, []);

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="flex-center"
    >
      {isLoading && (
        <Motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 0.7,
            ease: "linear",
          }}
        >
          <LoaderCircle size={size} stroke={palette.primary} strokeWidth={3} />
        </Motion.div>
      )}
      {!isLoading && (
        <Motion.div
          style={{ width: 0 }}
          animate={{ width: size }}
          initial={initialRef.current}
        >
          <Circle size={size} stroke={palette.primary} fill={palette.soft} />
        </Motion.div>
      )}
    </div>
  );
};

export default CircleChip;
