interface AuthDividerProps {
  label?: string;
}

export const AuthDivider = ({ label = "Or continue with" }: AuthDividerProps) => (
  <div className="my-4 flex items-center gap-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6f6a92]">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />
    {label}
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />
  </div>
);
