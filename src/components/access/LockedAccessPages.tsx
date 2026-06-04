import { ArrowLeft, Home, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";

interface LockedAccessPageProps {
  message?: string | null;
  title?: string;
}

export const AppLockedPage = ({ message, title }: LockedAccessPageProps) => (
  <main className="grid min-h-screen place-items-center bg-gradient-to-b from-zinc-950 via-slate-950 to-black px-6 py-10 text-white">
    <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-amber-400/15 text-amber-200">
        <Lock className="size-7" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">
        {title || "App temporarily locked"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-300">
        {message ||
          "The Gas Law Simulation app is temporarily unavailable. Please check back later."}
      </p>
      <div className="mt-8 flex justify-center">
        <LogoutButton variant="outline" className="bg-white text-zinc-950" />
      </div>
    </section>
  </main>
);

export const FeatureLockedPage = ({ message, title }: LockedAccessPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-12">
      <section className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-zinc-100 text-zinc-700">
          <Lock className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-zinc-950">
          {title || "Feature locked"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {message || "This feature is currently locked by the administrator."}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />
            Go back
          </Button>
          <Button asChild>
            <Link to="/home">
              <Home className="size-4" />
              Home
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
