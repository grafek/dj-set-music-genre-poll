import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className }: Props) {
  return (
    <>
      <main
        className={`container px-4 mx-auto min-h-[calc(100dvh-8rem)] flex flex-col items-center gap-10 ${className}`}
      >
        {children}
      </main>
      <Toaster />
    </>
  );
}
