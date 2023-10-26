type Props = { width?: number; height?: number; className?: string };

export function TextSkeleton({ width, height = 1.5, className = "" }: Props) {
  return (
    <div
      style={{ width: `${width}rem`, height: `${height}rem` }}
      className={`rounded-md animate-pulse bg-primary-300 ${className}`}
    />
  );
}
