import { cn } from "@/lib/utils";

/* Shared class tokens translated from the auth design reference. */

export const authInputClass =
  "w-full rounded-[11px] border border-white/[0.14] bg-white/[0.045] px-[15px] py-[13px] text-[15px] text-[#f3f1fb] outline-none transition placeholder:text-[#6f6a92] hover:bg-white/[0.075] focus:border-[#78c49e]/80 focus:bg-white/[0.075] focus:shadow-[0_0_0_3px_rgba(47,181,116,0.16)] disabled:cursor-not-allowed disabled:opacity-50";

const btnBase =
  "flex w-full items-center justify-center gap-2.5 rounded-[11px] px-[18px] py-[14px] text-[15px] font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

export const authPrimaryButtonClass = cn(
  btnBase,
  "bg-gradient-to-b from-[#38c47f] to-[#2fb574] text-white shadow-[0_10px_26px_-10px_rgba(47,181,116,0.45)] hover:from-[#41cf89] hover:to-[#38c47f]"
);

export const authSocialButtonClass = cn(
  btnBase,
  "border border-white/[0.14] bg-white/[0.05] font-medium text-[#f3f1fb] hover:border-white/20 hover:bg-white/[0.09]"
);

export const authGhostButtonClass = cn(
  btnBase,
  "border border-white/[0.14] bg-transparent font-medium text-[#c9c5e4] hover:bg-white/[0.06] hover:text-[#f3f1fb]"
);

export const authQuietLinkClass =
  "text-[13px] text-[#948fb6] transition hover:text-[#f3f1fb]";

export const authFootLinkClass =
  "font-semibold text-[#f3f1fb] underline decoration-white/30 underline-offset-4 transition hover:decoration-white/60";
