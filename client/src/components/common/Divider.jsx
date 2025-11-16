const Divider = ({ className = "" }) => (
  <hr
    className={`my-4 border-t border-[neutralc-200] ${className}`.trim()}
    aria-hidden="true"
  />
);

export default Divider;
