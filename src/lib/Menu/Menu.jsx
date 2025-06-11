import useWindowSize from "@/hooks/useWindowSize";
import PopoverMenu from "./PopoverMenu";
import BottomSlideOverMenu from "./BottomSlideOverMenu";

const Menu = ({ title, renderOpener, renderContent }) => {
  const windowSize = useWindowSize();

  return (
    <>
      {windowSize === "phone" && (
        <BottomSlideOverMenu
          title={title}
          renderOpener={renderOpener}
          renderContent={renderContent}
        />
      )}
      {windowSize !== "phone" && (
        <PopoverMenu
          title={title}
          renderOpener={renderOpener}
          renderContent={renderContent}
        />
      )}
    </>
  );
};

export default Menu;
