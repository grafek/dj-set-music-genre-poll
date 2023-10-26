import { dateFormatter } from "../helpers";

type Props = { id: string; djSetDate: string; className?: string };

export default function Poll({ id, djSetDate, className }: Props) {
  return (
    <a
      href={`/poll/${id}`}
      className={`px-3 flex-1 py-2 border border-primary-200 block rounded transition-colors duration-200 hover:bg-primary-400 ${className}`}
    >
      {dateFormatter(new Date(djSetDate))}
    </a>
  );
}
