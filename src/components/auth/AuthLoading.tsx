import { Loader2 } from "lucide-react";

import { MoleculeBackground } from "@/components/MoleculeBackground";

export const AuthLoading = () => (
  <main className="relative grid min-h-screen place-items-center overflow-hidden p-6">
    <MoleculeBackground className="absolute inset-0" />
    <div className="relative z-[1] flex flex-col items-center gap-4 text-center">
      <div
        className="grid size-[62px] place-items-center rounded-[17px] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
        style={{ background: "linear-gradient(155deg, #ffffff, #e7e3fb)" }}
      >
        <img src="/atom.png" alt="" className="size-[38px]" />
      </div>
      <div className="flex items-center gap-2 text-[14px] font-medium text-[#c9c5e4]">
        <Loader2 className="size-4 animate-spin" />
        Checking your session...
      </div>
    </div>
  </main>
);
