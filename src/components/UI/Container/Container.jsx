const Container = ({
  padding,
  minWidth,
  width = "100%",
  maxWidth,
  align = "center",
  children,
  ...props
}) => {
  return (
    <div style={{ display: "flex", justifyContent: align, padding }} {...props}>
      <div style={{ width, minWidth, maxWidth }}>{children}</div>
    </div>
  );
};

export default Container;
