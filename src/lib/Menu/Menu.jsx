import useWindowSize from "@/hooks/useWindowSize";
import PopoverMenu from "./components/PopoverMenu";
import BottomSlideOverMenu from "./components/BottomSlideOverMenu";

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
