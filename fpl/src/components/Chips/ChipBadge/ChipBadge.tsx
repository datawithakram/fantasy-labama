interface ChipBadgeProps {
  path: string;
  sizes: string;
}

export const ChipBadge = ({ path, sizes }: ChipBadgeProps) => (
  <img
    aria-hidden={true}
    src={`${path}-120.png`}
    srcSet={`
        ${path}-120.png 120w,
        ${path}-240.png 240w,
        ${path}-480.png 480w,
        `}
    sizes={sizes}
    alt=""
  />
);

export default ChipBadge;
