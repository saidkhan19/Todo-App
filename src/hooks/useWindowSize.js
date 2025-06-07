import { useEffect, useState } from "react";

const getWindowSize = () => {
  const size = window.innerWidth;
  if (size <= 540) return "phone";
  if (size <= 775) return "tablet";
  return "desktop";
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    const handleResize = () => setWindowSize(getWindowSize());
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
