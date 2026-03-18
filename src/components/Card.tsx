import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`bg-zinc-900 rounded-xl p-6 py-5 border border-zinc-800 ${className}`}>
      {children}
    </section>
  );
}

export function CardInner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`bg-white/5 rounded-lg p-4 ${className}`}>{children}</div>;
}
