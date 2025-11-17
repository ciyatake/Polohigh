const Skeleton = ({ className = "", rounded = true }) => (
  <div
    className={`${
      rounded ? "rounded-md" : ""
    } shimmer bg-primary-100 ${className}`.trim()}
    aria-hidden="true"
  />
);

export default Skeleton;
