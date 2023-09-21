type Props = { width?: number; height?: number };

export function TextSkeleton({ width = 10, height = 1.5 }: Props) {
  return (
    <div
      style={{ width: `${width}rem`, height: `${height}rem` }}
      className="rounded-md animate-pulse bg-primary-300"
    ></div>
  );
}
