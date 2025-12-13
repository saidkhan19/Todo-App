import { NavLink } from "react-router";

const PreloadNavlink = ({ preloadFn, children, ...props }) => {
  return (
    <NavLink {...props} onMouseEnter={preloadFn} onTouchStart={preloadFn}>
      {children}
    </NavLink>
  );
};

export default PreloadNavlink;
