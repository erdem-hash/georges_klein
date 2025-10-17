import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:opacity-95",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "bg-transparent hover:bg-slate-100",
      },
      size: { default: "h-10", icon: "h-10 w-10 p-0" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export function Button({ className, variant, size, ...props }: ButtonProps) {
  const cls = buttonVariants({ variant, size });
  return <button className={cls + (className ? " " + className : "")} {...props} />;
}
