import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark disabled:bg-ink-muted",
  secondary: "bg-white text-ink border border-border hover:bg-cream-200",
  ghost: "bg-transparent text-ink-light hover:bg-cream-200",
  danger: "bg-transparent text-red-600 hover:bg-red-50",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ variant = "primary", className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";
