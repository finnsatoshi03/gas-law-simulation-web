import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthPageProps {
  children: ReactNode;
  description: ReactNode;
  footer?: ReactNode;
  title: string;
  /** Optional icon rendered above the heading (success screens). */
  icon?: ReactNode;
  /** Center-align the card head + footer (success screens). */
  center?: boolean;
}

const BrandLockup = () => (
  <div className="relative z-[1] flex flex-col items-center gap-3.5">
    <div
      className="grid size-[62px] place-items-center rounded-[17px] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
      style={{ background: "linear-gradient(155deg, #ffffff, #e7e3fb)" }}
    >
      <img src="/atom.png" alt="" className="size-[38px]" />
    </div>
    <p className="m-0 font-sciFi text-[18px] font-medium uppercase tracking-[0.28em] text-[#d9d5f2] [text-indent:0.28em]">
      Gas Laws Simulation
    </p>
  </div>
);

export const AuthPage = ({
  children,
  description,
  footer,
  title,
  icon,
  center,
}: AuthPageProps) => (
  <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-[26px] px-5 py-10">
    <BrandLockup />

    <section className="relative z-[1] w-full max-w-[440px] rounded-[20px] border border-white/[0.13] bg-[#16122e]/60 p-8 shadow-[0_30px_80px_-20px_rgba(5,4,18,0.75)] backdrop-blur-2xl sm:p-9">
      {icon}
      <div className={cn("mb-6", center && "text-center")}>
        <h1 className="m-0 mb-2 text-[27px] font-semibold leading-tight tracking-tight text-[#f3f1fb]">
          {title}
        </h1>
        <p className="m-0 text-[14.5px] leading-relaxed text-[#948fb6]">
          {description}
        </p>
      </div>

      {children}

      {footer ? (
        <div
          className={cn(
            "mt-[22px] text-[14px] text-[#948fb6]",
            center !== false && "text-center"
          )}
        >
          {footer}
        </div>
      ) : null}
    </section>

    <p className="relative z-[1] max-w-[420px] text-center text-[13.5px] leading-relaxed text-[#6f6a92]">
      Explore the fascinating behavior of gas molecules under different
      conditions.
    </p>
  </main>
);
