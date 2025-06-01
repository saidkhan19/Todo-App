import PropTypes from "prop-types";

const CircleChip = ({ palette }) => {
  return (
    <span
      style={{
        width: "11px",
        aspectRatio: "1",
        display: "inline-block",
        borderRadius: "50%",
        border: `1px solid ${palette.primary}`,
        backgroundColor: palette.soft,
      }}
      aria-hidden="true"
    />
  );
};

CircleChip.propTypes = {
  palette: PropTypes.object,
};

export default CircleChip;
