type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
  return (
    <>
      <header>
        <h1 className="text-3xl text-center pt-2 pb-20">Music genre poll</h1>
      </header>
      <main className="container px-4 mx-auto h-[calc(100dvh-7.75rem)] flex flex-col items-center gap-10">
        {children}
      </main>
    </>
  );
}