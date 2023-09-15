import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className }: Props) {
  return (
    <>
      <header>
        <h1 className="text-3xl text-center pt-2 pb-12">Music genre poll</h1>
      </header>
      <main
        className={`container px-4 mx-auto min-h-[calc(100dvh-8rem)] flex flex-col items-center gap-10 ${className}`}
      >
        {children}
      </main>
      <Toaster />
    </>
  );
}
